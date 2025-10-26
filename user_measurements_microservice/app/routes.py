from flask import Blueprint, request, jsonify, current_app
from . import db
from .models import UserMeasurements, ProgressMetric, PeriodType
import requests
from datetime import date, datetime
from flask_jwt_extended import (jwt_required, get_jwt_identity, get_jwt)

bp = Blueprint('api', __name__)


def _extract_bearer_token():
    auth = request.headers.get('Authorization', '')
    if auth and auth.startswith('Bearer '):
        return auth.split(' ', 1)[1]
    return None


def check_user_exists(user_id: int, token: str | None = None) -> bool:
    """Check user existence in external microservice.

    If token is provided, forward it to the users service as Bearer. If not,
    attempt to extract the incoming Authorization header and forward that.
    """
    users_base = current_app.config.get('USERS_SERVICE_URL', 'http://athletia:3000')
    url = f"{users_base}/users/{user_id}"
    if not token:
        token = _extract_bearer_token()
    headers = {"Authorization": f"Bearer {token}"} if token else {}
    try:
        resp = requests.get(url, headers=headers, timeout=2)
        current_app.logger.debug(
            "User service responded %s for user_id %s: %s",
            resp.status_code,
            user_id,
            getattr(resp, 'text', None),
        )
        return resp.status_code == 200
    except requests.RequestException:
        return False


def parse_date(d: str):
    try:
        return date.fromisoformat(d)
    except Exception:
        return None


def parse_datetime(d: str):
    try:
        return datetime.fromisoformat(d)
    except Exception:
        return None

@bp.route('/user_measurements', methods=['GET'])
@jwt_required()
def list_user_measurements():
    current_user = get_jwt_identity()
    user_id = request.args.get('user_id', type=str)
    q = UserMeasurements.query
    if user_id:
        if str(user_id) != str(current_user):
            return jsonify({'error': 'Unauthorized access to other user statistics'}), 403
        q = q.filter_by(user_id=user_id)
    items = q.all()
    return jsonify([s.to_dict() for s in items]), 200


@bp.route('/user_measurements', methods=['POST'])
@jwt_required()
def create_user_measurements():
    current_user = get_jwt_identity()
    data = request.get_json() or {}
    required = ['user_id', 'startDate', 'endDate', 'periodType']
    for f in required:
        if f not in data:
            return jsonify({'error': f'Missing field: {f}'}), 400
    # Ensure the caller is creating user measurements only for themselves (basic ownership check)
    if str(data.get('user_id')) != str(current_user):
        return jsonify({'error': 'Cannot create user measurements for a different user'}), 403

    if not check_user_exists(data['user_id']):
        return jsonify({'error': 'Referenced user_id not found in user service'}), 400

    sd = parse_date(data['startDate'])
    ed = parse_date(data['endDate'])
    if not sd or not ed:
        return jsonify({'error': 'startDate and endDate must be ISO dates (YYYY-MM-DD)'}), 400

    try:
        period = PeriodType(data['periodType'])
    except ValueError:
        return jsonify({'error': 'Invalid periodType'}), 400

    # Build UserMeasurements with optional measurement fields
    stat = UserMeasurements(
        user_id=data['user_id'],
        startDate=sd,
        endDate=ed,
        periodType=period,
    )
    # optional numeric fields
    for fld in ['weight', 'height', 'left_arm', 'right_arm', 'left_forearm', 'right_forearm',
                'clavicular_width', 'neck_diameter', 'chest_size', 'back_width', 'hip_diameter',
                'left_leg', 'right_leg', 'left_calve', 'right_calve']:
        if fld in data:
            try:
                setattr(stat, fld, float(data[fld]))
            except Exception:
                return jsonify({'error': f'Invalid numeric value for {fld}'}), 400
    db.session.add(stat)
    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Database error', 'details': str(e)}), 500

    return jsonify(stat.to_dict()), 201


@bp.route('/user_measurements/<stat_id>', methods=['GET'])
@jwt_required()
def get_user_measurements(stat_id: str):
    current_user = get_jwt_identity()
    stat = UserMeasurements.query.get_or_404(stat_id)
    if str(stat.user_id) != str(current_user):
        return jsonify({'error': 'Unauthorized access to this statistics resource'}), 403
    return jsonify(stat.to_dict(include_metrics=True)), 200


@bp.route('/user_measurements/<stat_id>', methods=['PUT'])
@jwt_required()
def update_user_measurements(stat_id: str):
    current_user = get_jwt_identity()
    stat = UserMeasurements.query.get_or_404(stat_id)
    if str(stat.user_id) != str(current_user):
        return jsonify({'error': 'Unauthorized to update this statistics resource'}), 403
    data = request.get_json() or {}

    if 'user_id' in data:
        if not check_user_exists(data['user_id']):
            return jsonify({'error': 'Referenced user_id not found in user service'}), 400
        stat.user_id = data['user_id']

    if 'startDate' in data:
        sd = parse_date(data['startDate'])
        if not sd:
            return jsonify({'error': 'Invalid startDate'}), 400
        stat.startDate = sd

    if 'endDate' in data:
        ed = parse_date(data['endDate'])
        if not ed:
            return jsonify({'error': 'Invalid endDate'}), 400
        stat.endDate = ed

    if 'periodType' in data:
        try:
            stat.periodType = PeriodType(data['periodType'])
        except ValueError:
            return jsonify({'error': 'Invalid periodType'}), 400

    # allow updating measurement fields
    for fld in ['weight', 'height', 'left_arm', 'right_arm', 'left_forearm', 'right_forearm',
                'clavicular_width', 'neck_diameter', 'chest_size', 'back_width', 'hip_diameter',
                'left_leg', 'right_leg', 'left_calve', 'right_calve']:
        if fld in data:
            try:
                setattr(stat, fld, float(data[fld]))
            except Exception:
                return jsonify({'error': f'Invalid numeric value for {fld}'}), 400

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Database error', 'details': str(e)}), 500

    return jsonify(stat.to_dict()), 200


@bp.route('/user_measurements/<stat_id>', methods=['DELETE'])
@jwt_required()
def delete_user_measurements(stat_id: str):
    current_user = get_jwt_identity()
    stat = UserMeasurements.query.get_or_404(stat_id)
    if str(stat.user_id) != str(current_user):
        return jsonify({'error': 'Unauthorized to delete this statistics resource'}), 403
    try:
        db.session.delete(stat)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Database error', 'details': str(e)}), 500
    return jsonify({'deleted': stat_id}), 200


@bp.route('/user_measurements/<stat_id>/progress_metrics', methods=['GET'])
@jwt_required()
def list_metrics_for_user_measurements(stat_id: str):
    current_user = get_jwt_identity()
    stat = UserMeasurements.query.get_or_404(stat_id)
    if str(stat.user_id) != str(current_user):
        return jsonify({'error': 'Unauthorized access to metrics for this statistics'}), 403
    metrics = ProgressMetric.query.filter_by(statistics_id=stat_id).all()
    return jsonify([m.to_dict() for m in metrics]), 200


@bp.route('/user_measurements/<stat_id>/progress_metrics', methods=['POST'])
@jwt_required()
def create_metric_under_user_measurements(stat_id: str):
    current_user = get_jwt_identity()
    _stat = UserMeasurements.query.get_or_404(stat_id)
    if str(_stat.user_id) != str(current_user):
        return jsonify({'error': 'Unauthorized to add metrics to this statistics'}), 403
    data = request.get_json() or {}
    required = ['metricType', 'value', 'recordedAt']
    for f in required:
        if f not in data:
            return jsonify({'error': f'Missing field: {f}'}), 400

    # metricType is now a free-form string
    mtype = str(data['metricType'])

    dt = parse_datetime(data['recordedAt'])
    if not dt:
        return jsonify({'error': 'Invalid recordedAt (ISO datetime expected)'}), 400

    try:
        value = float(data['value'])
    except Exception:
        return jsonify({'error': 'value must be numeric'}), 400

    metric = ProgressMetric(statistics_id=stat_id, metricType=mtype, value=value, recordedAt=dt)
    db.session.add(metric)
    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Database error', 'details': str(e)}), 500

    return jsonify(metric.to_dict()), 201


@bp.route('/progress_metrics', methods=['GET'])
@jwt_required()
def list_metrics():
    current_user = get_jwt_identity()
    stats_id = request.args.get('statistics_id')
    q = ProgressMetric.query
    if stats_id:
        # Ensure the requested statistics belongs to the caller
        stat = UserMeasurements.query.get_or_404(stats_id)
        if str(stat.user_id) != str(current_user):
            return jsonify({'error': 'Unauthorized access to metrics for this statistics'}), 403
        q = q.filter_by(statistics_id=stats_id)
    items = q.all()
    return jsonify([m.to_dict() for m in items]), 200


@bp.route('/progress_metrics/<metric_id>', methods=['GET'])
@jwt_required()
def get_metric(metric_id: str):
    current_user = get_jwt_identity()
    metric = ProgressMetric.query.get_or_404(metric_id)
    stat = UserMeasurements.query.get_or_404(metric.statistics_id)
    if str(stat.user_id) != str(current_user):
        return jsonify({'error': 'Unauthorized access to this metric'}), 403
    return jsonify(metric.to_dict()), 200


@bp.route('/progress_metrics/<metric_id>', methods=['PUT'])
@jwt_required()
def update_metric(metric_id: str):
    current_user = get_jwt_identity()
    metric = ProgressMetric.query.get_or_404(metric_id)
    stat = UserMeasurements.query.get_or_404(metric.statistics_id)
    if str(stat.user_id) != str(current_user):
        return jsonify({'error': 'Unauthorized to update this metric'}), 403
    data = request.get_json() or {}

    if 'metricType' in data:
        metric.metricType = str(data['metricType'])

    if 'value' in data:
        try:
            metric.value = float(data['value'])
        except Exception:
            return jsonify({'error': 'value must be numeric'}), 400

    if 'recordedAt' in data:
        dt = parse_datetime(data['recordedAt'])
        if not dt:
            return jsonify({'error': 'Invalid recordedAt (ISO datetime expected)'}), 400
        metric.recordedAt = dt

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Database error', 'details': str(e)}), 500

    return jsonify(metric.to_dict()), 200


@bp.route('/progress_metrics/<metric_id>', methods=['DELETE'])
@jwt_required()
def delete_metric(metric_id: str):
    current_user = get_jwt_identity()
    metric = ProgressMetric.query.get_or_404(metric_id)
    stat = UserMeasurements.query.get_or_404(metric.statistics_id)
    if str(stat.user_id) != str(current_user):
        return jsonify({'error': 'Unauthorized to delete this metric'}), 403
    try:
        db.session.delete(metric)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Database error', 'details': str(e)}), 500
    return jsonify({'deleted': metric_id}), 200


@bp.route('/admin/drop_schema', methods=['POST'])
@jwt_required()
def admin_drop_schema():
    """Administrative endpoint to DROP all tables in the database.

    Requires a JSON body: {"confirm": true} to avoid accidental invocation.
    Use with caution (development only).
    """
    data = request.get_json() or {}
    # Basic admin check: require a claim `is_admin` in the JWT or identity 'admin'
    token_claims = get_jwt()
    current_user = get_jwt_identity()
    if not (token_claims.get('is_admin') or str(current_user) == 'admin'):
        return jsonify({'error': 'Admin privileges required'}), 403

    if not data.get('confirm'):
        return jsonify({'error': 'Must provide {"confirm": true} in body to drop schema'}), 400

    try:
        # Drops all tables; do not use in production unless you know what you're doing.
        db.drop_all()
        return jsonify({'status': 'ok', 'message': 'All tables dropped'}), 200
    except Exception as e:
        return jsonify({'error': 'Database error', 'details': str(e)}), 500


@bp.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'}), 200
