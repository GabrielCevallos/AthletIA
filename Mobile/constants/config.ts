const env = process.env.EXPO_PUBLIC_ENV || 'development';

// Construcción dinámica de API URL
const developmentIp = process.env.EXPO_PUBLIC_DEVELOPMENT_IP || 'localhost';
const apiPort = process.env.EXPO_PUBLIC_API_PORT || '3000';
const frontendWebPort = process.env.EXPO_PUBLIC_FRONTEND_WEB_PORT || '5173';

// Si EXPO_PUBLIC_API_URL está definida (producción), usarla directamente
// Si no, construir con IP y puerto (desarrollo)
const apiUrl = process.env.EXPO_PUBLIC_API_URL || `http://${developmentIp}:${apiPort}`;

// Si EXPO_PUBLIC_FRONTEND_WEB_URL está definida (producción), usarla directamente
// Si no, construir con IP y puerto (desarrollo)
const frontendWebUrl = process.env.EXPO_PUBLIC_FRONTEND_WEB_URL || `http://${developmentIp}:${frontendWebPort}`;

export const Config = {
  env,
  apiUrl,
  frontendWebUrl,
};

