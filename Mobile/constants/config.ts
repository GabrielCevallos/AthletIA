const ENV: 'dev' | 'prod' = 'dev'; // Cambia a 'prod' cuando vayas a desplegar la app

const API_URLS = {
  dev: 'http://192.168.110.145:3000', // IP local de tu computadora para desarrollo
  prod: 'https://api.athletia.com',   // URL de producción (cámbiala por la real)
};

export const Config = {
  env: ENV,
  apiUrl: API_URLS[ENV],
};
