import json
import threading
import time
import os
import pika
from flask import current_app

from . import db
from .models import UserMeasurements, ProgressMetric, PeriodType
from datetime import date, datetime


def _parse_date(d):
    if not d:
        return None
    if isinstance(d, date):
        return d
    try:
        return date.fromisoformat(d)
    except Exception:
        try:
            return datetime.fromisoformat(d).date()
        except Exception:
            return None


def _get_rabbit_connection_params():
    host = os.environ.get('RABBITMQ_HOST', 'rabbitmq')
    port = int(os.environ.get('RABBITMQ_PORT', '5672'))
    user = os.environ.get('RABBITMQ_USER', 'guest')
    password = os.environ.get('RABBITMQ_PASSWORD', 'guest')
    credentials = pika.PlainCredentials(user, password)
    return pika.ConnectionParameters(host=host, port=port, credentials=credentials)


def handle_message(body: bytes):
    try:
        payload = json.loads(body)
    except Exception:
        current_app.logger.exception('Invalid JSON in RMQ message')
        return

    typ = payload.get('type')
    data = payload.get('data', {})

    # Simple handlers: create/update/delete user_measurements, create progress metric
    try:
        if typ == 'user_measurements.created' or typ == 'user_measurements.updated':
            # Upsert: if id exists update, else create
            um = None
            is_new = False
            if 'id' in data:
                um = UserMeasurements.query.get(data['id'])
                if not um:
                    um = UserMeasurements()
                    is_new = True
            else:
                um = UserMeasurements()
                is_new = True

            # Ensure required fields are set. user_id should come from the message.
            # If missing, assign a placeholder string for new records. For updates only set when provided.
            user_id_val = data.get('user_id') or data.get('userId') or data.get('user')
            if is_new:
                if user_id_val is None:
                    user_id_val = str(data.get('id') or '') or 'unknown'
                um.user_id = user_id_val
            else:
                if user_id_val is not None:
                    um.user_id = user_id_val

            # startDate / endDate: parse ISO date if provided, otherwise default to today
            if is_new:
                sd = _parse_date(data.get('startDate') or data.get('start_date')) or date.today()
                ed = _parse_date(data.get('endDate') or data.get('end_date')) or date.today()
                um.startDate = sd
                um.endDate = ed
                # if an id was provided in the message, use it for the new record
                if 'id' in data and data.get('id'):
                    try:
                        um.id = str(data.get('id'))
                    except Exception:
                        pass
            else:
                sd = _parse_date(data.get('startDate') or data.get('start_date'))
                ed = _parse_date(data.get('endDate') or data.get('end_date'))
                if sd:
                    um.startDate = sd
                if ed:
                    um.endDate = ed

            # periodType: try to map to PeriodType enum, fallback to custom.
            pt = data.get('periodType') or data.get('period_type')
            if is_new:
                try:
                    um.periodType = PeriodType(pt) if pt else PeriodType.custom
                except Exception:
                    try:
                        um.periodType = PeriodType(pt)
                    except Exception:
                        um.periodType = PeriodType.custom
            else:
                if pt:
                    try:
                        um.periodType = PeriodType(pt)
                    except Exception:
                        # ignore invalid periodType on updates
                        pass

            # weight/height: use provided or sensible defaults
            if is_new:
                try:
                    um.weight = float(data.get('weight')) if data.get('weight') is not None else 70.0
                except Exception:
                    um.weight = 70.0
                try:
                    um.height = float(data.get('height')) if data.get('height') is not None else 170.0
                except Exception:
                    um.height = 170.0
            else:
                if 'weight' in data:
                    try:
                        um.weight = float(data.get('weight')) if data.get('weight') is not None else None
                    except Exception:
                        pass
                if 'height' in data:
                    try:
                        um.height = float(data.get('height')) if data.get('height') is not None else None
                    except Exception:
                        pass

            # Optional measurement fields: allow None if not provided
            for fld in ['left_arm', 'right_arm', 'left_forearm', 'right_forearm', 'clavicular_width',
                        'neck_diameter', 'chest_size', 'back_width', 'hip_diameter', 'left_leg',
                        'right_leg', 'left_calve', 'right_calve']:
                if fld in data:
                    try:
                        setattr(um, fld, float(data[fld]) if data[fld] is not None else None)
                    except Exception:
                        setattr(um, fld, None)

            db.session.add(um)
            db.session.commit()
            current_app.logger.info('UserMeasurements upserted via RMQ id=%s', um.id)

        elif typ == 'user_measurements.deleted':
            # support deletion by user_measurements.id or by user_id (account id)
            uid = data.get('id')
            if uid:
                um = UserMeasurements.query.get(uid)
            else:
                user_id = data.get('user_id')
                um = None
                if user_id:
                    um = UserMeasurements.query.filter_by(user_id=user_id).first()
            if um:
                db.session.delete(um)
                db.session.commit()
                current_app.logger.info('UserMeasurements deleted via RMQ id=%s', getattr(um, 'id', user_id))

        elif typ == 'progress_metric.created':
            # create a progress metric under a user_measurements
            m = ProgressMetric()
            for fld in ['id', 'statistics_id', 'metricType', 'value', 'recordedAt']:
                if fld in data:
                    setattr(m, fld, data[fld])
            db.session.add(m)
            db.session.commit()
            current_app.logger.info('ProgressMetric created via RMQ id=%s', m.id)

        else:
            current_app.logger.debug('Unhandled RMQ message type: %s', typ)
    except Exception:
        current_app.logger.exception('Error handling RMQ message')


def _consume_loop():
    params = _get_rabbit_connection_params()
    while True:
        try:
            conn = pika.BlockingConnection(params)
            ch = conn.channel()
            exchange = os.environ.get('RABBITMQ_EXCHANGE', 'athletia')
            ch.exchange_declare(exchange=exchange, exchange_type='topic', durable=True)
            qname = os.environ.get('RABBITMQ_QUEUE', 'user_measurements.queue')
            ch.queue_declare(queue=qname, durable=True)
            # bind relevant routing keys
            ch.queue_bind(queue=qname, exchange=exchange, routing_key='user_measurements.*')
            ch.queue_bind(queue=qname, exchange=exchange, routing_key='progress_metric.*')

            for method_frame, properties, body in ch.consume(qname, inactivity_timeout=1):
                if method_frame is None:
                    # timeout
                    continue
                try:
                    handle_message(body)
                finally:
                    ch.basic_ack(method_frame.delivery_tag)

        except Exception:
            current_app.logger.exception('RMQ consumer error, retrying in 5s')
            time.sleep(5)
        finally:
            try:
                if 'conn' in locals() and conn is not None:
                    try:
                        conn.close()
                    except Exception:
                        pass
            except Exception:
                # defensive: avoid crashing the loop if locals() access fails
                pass


def start_consumer(app):
    # run the blocking consumer in a thread and ensure the Flask application
    # context is available to the thread so `current_app` and DB operations work.
    def _run_with_appctx():
        with app.app_context():
            _consume_loop()

    thr = threading.Thread(target=_run_with_appctx, daemon=True)
    thr.start()
    app.logger.info('Started RMQ consumer thread')
