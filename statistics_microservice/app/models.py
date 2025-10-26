from . import db
import enum
import uuid
from sqlalchemy import Enum as SQLAEnum
from datetime import datetime, date


class PeriodType(enum.Enum):
    weekly = 'weekly'
    monthly = 'monthly'
    custom = 'custom'


class UserMeasurements(db.Model):
    __tablename__ = 'user_measurements'

    # Use UUID strings for ids so external services can reference them easily
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    # Logical reference to external user service; do NOT create FK here
    user_id = db.Column(db.String(36), nullable=False)
    startDate = db.Column(db.Date, nullable=False)
    endDate = db.Column(db.Date, nullable=False)
    periodType = db.Column(SQLAEnum(PeriodType, name='periodtype', native_enum=False), nullable=False)

    # Measurement attributes
    weight = db.Column(db.Float, nullable=False)
    height = db.Column(db.Float, nullable=False)
    # imc will be exposed as a computed property (not stored by default)
    left_arm = db.Column(db.Float, nullable=True)
    right_arm = db.Column(db.Float, nullable=True)
    left_forearm = db.Column(db.Float, nullable=True)
    right_forearm = db.Column(db.Float, nullable=True)
    clavicular_width = db.Column(db.Float, nullable=True)
    neck_diameter = db.Column(db.Float, nullable=True)
    chest_size = db.Column(db.Float, nullable=True)
    back_width = db.Column(db.Float, nullable=True)
    hip_diameter = db.Column(db.Float, nullable=True)
    left_leg = db.Column(db.Float, nullable=True)
    right_leg = db.Column(db.Float, nullable=True)
    left_calve = db.Column(db.Float, nullable=True)
    right_calve = db.Column(db.Float, nullable=True)

    progress_metrics = db.relationship(
        'ProgressMetric', backref='user_measurements', cascade='all, delete-orphan', lazy=True
    )

    def compute_imc(self):
        """Compute IMC (BMI) from weight (kg) and height (cm).

        Returns None if weight or height is missing or invalid.
        """
        try:
            if self.weight is None or self.height is None:
                return None
            # assume height provided in centimeters, convert to meters
            h_m = float(self.height) / 100.0
            if h_m <= 0:
                return None
            return float(self.weight) / (h_m * h_m)
        except Exception:
            return None

    def to_dict(self, include_metrics=False):
        data = {
            'id': self.id,
            'user_id': self.user_id,
            'startDate': self.startDate.isoformat() if isinstance(self.startDate, date) else None,
            'endDate': self.endDate.isoformat() if isinstance(self.endDate, date) else None,
            'periodType': self.periodType.value if self.periodType else None,
            'weight': self.weight,
            'height': self.height,
            'imc': self.compute_imc(),
            'left_arm': self.left_arm,
            'right_arm': self.right_arm,
            'left_forearm': self.left_forearm,
            'right_forearm': self.right_forearm,
            'clavicular_width': self.clavicular_width,
            'neck_diameter': self.neck_diameter,
            'chest_size': self.chest_size,
            'back_width': self.back_width,
            'hip_diameter': self.hip_diameter,
            'left_leg': self.left_leg,
            'right_leg': self.right_leg,
            'left_calve': self.left_calve,
            'right_calve': self.right_calve,
        }
        if include_metrics:
            data['progress_metrics'] = [m.to_dict() for m in self.progress_metrics]
        return data


class ProgressMetric(db.Model):
    __tablename__ = 'progress_metric'

    # Use UUID strings for ids to match UserMeasurements.id
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    statistics_id = db.Column(db.String(36), db.ForeignKey('user_measurements.id', ondelete='CASCADE'), nullable=False)
    # metricType is now a free-form string (previously an enum)
    metricType = db.Column(db.String(80), nullable=False)
    value = db.Column(db.Float, nullable=False)
    recordedAt = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'statistics_id': self.statistics_id,
            'metricType': self.metricType,
            'value': self.value,
            'recordedAt': self.recordedAt.isoformat() if isinstance(self.recordedAt, datetime) else None,
        }
