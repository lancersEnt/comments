import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { CommentsModule } from './comments.module';

async function bootstrap() {
  const app = await NestFactory.create(CommentsModule);
  app.enableCors({
    origin: 'http://192.168.1.200:5173',
    credentials: true,
  });
  app.use(cookieParser());
  await app.listen(9229);
}

bootstrap();
