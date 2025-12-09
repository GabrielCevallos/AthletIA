import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

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
    origin: ['http://localhost:3001', 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  });

  // Swagger / OpenAPI
  const config = new DocumentBuilder()
    .setTitle('AthletIA API')
    .setDescription('API documentation for AthletIA')
    .setVersion(process.env.npm_package_version || '0.0.1')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'access-token')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  const port = parseInt(process.env.SERVER_PORT!);
  await app.listen(port);
}
void bootstrap();
