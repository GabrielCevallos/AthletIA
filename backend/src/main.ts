import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import helmet from 'helmet';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { expand } from 'dotenv-expand';
import { RateLimitGuard } from './common/guards/rate-limit.guard';
import { RateLimitService } from './common/guards/rate-limit.service';
import { DateSerializerInterceptor } from './common/interceptors/date-serializer.interceptor';

const myEnv = dotenv.config();
expand(myEnv);

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
  
  // Rate Limiting Guard
  const reflector = app.get(Reflector);
  const rateLimitService = app.get(RateLimitService);
  app.useGlobalGuards(new RateLimitGuard(reflector, rateLimitService));
  
  // Date Serializer Interceptor - asegura que todas las fechas se envíen en formato UTC con 'Z'
  app.useGlobalInterceptors(new DateSerializerInterceptor());
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove properties that do not have any decorators
      forbidNonWhitelisted: true, // throw an error if non-whitelisted properties are present
      transform: true, // automatically transform payloads to be objects typed according to their DTO classes
      transformOptions: {
        enableImplicitConversion: true, // enable implicit type conversion
      },
    }),
  );
  app.enableCors({
    origin: [
      'http://localhost:3001',
      'http://localhost:5174',
      'http://localhost:5175',
      process.env.FRONTEND_BASE_URL || 'http://localhost:5173',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  });

  // Swagger / OpenAPI
  const config = new DocumentBuilder()
    .setTitle('AthletIA API')
    .setDescription('API documentation for AthletIA')
    .setVersion(process.env.npm_package_version || '0.1.1')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  const port = parseInt(process.env.SERVER_PORT || '3000', 10);
  await app.listen(port, '0.0.0.0');
}
void bootstrap();
