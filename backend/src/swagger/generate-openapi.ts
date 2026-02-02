import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFile } from 'fs/promises';
import { AppModule } from '../app/app.module';
import * as dotenv from 'dotenv';
import { expand } from 'dotenv-expand';

const myEnv = dotenv.config();
expand(myEnv);

async function generateOpenApiJson() {
  const app = await NestFactory.create(AppModule, { logger: false });

  const config = new DocumentBuilder()
    .setTitle('AthletIA API')
    .setDescription('API documentation for AthletIA')
    .setVersion(process.env.npm_package_version || '0.0.1')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  const outputPath = 'openapi.json';

  await writeFile(outputPath, JSON.stringify(document, null, 2), 'utf8');
  await app.close();
}

void generateOpenApiJson();
