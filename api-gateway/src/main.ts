import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { createProxyMiddleware } from 'http-proxy-middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use('/athletia/api', createProxyMiddleware({
    target: 'http://athletia:3000/api',
    changeOrigin: true,
  }));
  app.use('/athletia/api-json', createProxyMiddleware({
  target: 'http://athletia:3000/api',
  changeOrigin: true,
}));
  await app.listen(process.env.SERVER_PORT ?? 3001);

}
bootstrap();
