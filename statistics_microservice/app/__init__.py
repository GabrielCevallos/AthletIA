from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager

db = SQLAlchemy()


def create_app():
    app = Flask(__name__)
    # Load configuration from project-level config.py
    app.config.from_object('config')

    db.init_app(app)

    # Initialize JWT manager using JWT config from config.py (JWT_SECRET_KEY)
    JWTManager(app)

    # Register blueprints
    from .routes import bp as api_bp
    app.register_blueprint(api_bp)

    # Start RabbitMQ consumer if configured
    try:
        from .rmq_consumer import start_consumer
        if app.config.get('RABBITMQ_ENABLED', True):
            start_consumer(app)
    except Exception:
        app.logger.exception('Failed to start RMQ consumer (it may be optional)')

    # Ensure database tables exist (for quick development/demo). In production use migrations.
    with app.app_context():
        # Optionally drop all tables at startup when enabled via config (development only).
        if app.config.get('DROP_SCHEMA_ON_STARTUP'):
            print('DROP_SCHEMA_ON_STARTUP is enabled: dropping all database tables...')
            db.drop_all()
        db.create_all()

    return app
