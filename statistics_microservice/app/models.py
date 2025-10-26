from . import db
import enum
import uuid
from sqlalchemy import Enum as SQLAEnum
from datetime import datetime, date


class PeriodType(enum.Enum):
    weekly = 'weekly'
    monthly = 'monthly'
    custom = 'custom'


class MetricType(enum.Enum):
    weight = 'weight'
    body_fat = 'body_fat'
    imc = 'imc'
    calories = 'calories'
    strength = 'strength'


class Statistics(db.Model):
    __tablename__ = 'statistics'

    # Use UUID strings for ids so external services can reference them easily
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    # Logical reference to external user service; do NOT create FK here
    user_id = db.Column(db.String(36), nullable=False)
    startDate = db.Column(db.Date, nullable=False)
    endDate = db.Column(db.Date, nullable=False)
    periodType = db.Column(SQLAEnum(PeriodType, name='periodtype', native_enum=False), nullable=False)

    progress_metrics = db.relationship(
        'ProgressMetric', backref='statistics', cascade='all, delete-orphan', lazy=True
    )

    def to_dict(self, include_metrics=False):
        data = {
            'id': self.id,
            'user_id': self.user_id,
            'startDate': self.startDate.isoformat() if isinstance(self.startDate, date) else None,
            'endDate': self.endDate.isoformat() if isinstance(self.endDate, date) else None,
            'periodType': self.periodType.value if self.periodType else None,
        }
        if include_metrics:
            data['progress_metrics'] = [m.to_dict() for m in self.progress_metrics]
        return data


class ProgressMetric(db.Model):
    __tablename__ = 'progress_metric'

    # Use UUID strings for ids to match Statistics.id
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    statistics_id = db.Column(db.String(36), db.ForeignKey('statistics.id', ondelete='CASCADE'), nullable=False)
    metricType = db.Column(SQLAEnum(MetricType, name='metrictype', native_enum=False), nullable=False)
    value = db.Column(db.Float, nullable=False)
    recordedAt = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'statistics_id': self.statistics_id,
            'metricType': self.metricType.value if self.metricType else None,
            'value': self.value,
            'recordedAt': self.recordedAt.isoformat() if isinstance(self.recordedAt, datetime) else None,
        }
