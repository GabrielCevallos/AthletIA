import os
from dotenv import load_dotenv

# Load .env when present
load_dotenv()

JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'your_jwt_secret_key')

# Database configuration via environment variables
DB_USER = os.getenv('DB_USER', 'postgres')
DB_PASS = os.getenv('DB_PASS', 'postgres')
DB_HOST = os.getenv('DB_HOST', 'localhost')
DB_PORT = os.getenv('DB_PORT', '5432')
DB_NAME = os.getenv('DB_NAME', 'athletia')

SQLALCHEMY_DATABASE_URI = (
    f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)
SQLALCHEMY_TRACK_MODIFICATIONS = False
SQLALCHEMY_ECHO = False 
# App settings
JSON_SORT_KEYS = False
# When true (set via env var DROP_SCHEMA_ON_STARTUP=1 or true), the app will
# drop all tables at startup before creating them. Use for development/testing
# only. Default: False
DROP_SCHEMA_ON_STARTUP = os.getenv('DROP_SCHEMA_ON_STARTUP', 'false').lower() in ('1', 'true', 'yes')
# URL for the main AthletIA users service (used to validate referenced user ids)
USERS_SERVICE_URL = os.getenv('USERS_SERVICE_URL', 'http://athletia:3000')
