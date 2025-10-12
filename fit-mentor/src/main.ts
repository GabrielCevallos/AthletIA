import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // elimina propiedades que no estén en el DTO
      forbidNonWhitelisted: true, // lanza error si hay propiedades extra
      transform: true, // convierte los objetos a clases (útil para usar `class-transformer`)
    }),
  );
  const port = parseInt(process.env.SERVER_PORT!);
  await app.listen(port);
}
void bootstrap();
