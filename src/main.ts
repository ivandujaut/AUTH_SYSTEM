import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port') || 8080;

  await app.listen(port);
  console.log(`
  [server]: Server is running at http://localhost:${port}
  [env]: ${configService.get('environment')}
  `);
}
bootstrap().catch(console.error);
