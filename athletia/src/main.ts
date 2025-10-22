import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Secure HTTP headers
  app.use(
    helmet({
      // Keep defaults; customize as needed
      // Example: only enable HSTS in production behind HTTPS
      hsts: process.env.NODE_ENV === 'production' ? undefined : false,
      // Hide X-Powered-By
      hidePoweredBy: true,
      // Basic referrer policy
      referrerPolicy: { policy: 'no-referrer' },
      // Cross-Origin Resource Policy (adjust for your static hosting if needed)
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // elimina propiedades que no estén en el DTO
      forbidNonWhitelisted: true, // lanza error si hay propiedades extra
      transform: true, // convierte los objetos a clases (útil para usar `class-transformer`)
    }),
  );
  app.enableCors({
    origin: 'http://localhost:3001', // dominio simpático del frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  const port = parseInt(process.env.SERVER_PORT!);
  await app.listen(port);
}
void bootstrap();
