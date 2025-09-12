import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //app.setGlobalPrefix('api');

  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:4200', // Angular dev server
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // if you're using cookies/auth
  });

  // Serve /uploads path
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,   // 👈 important
    transformOptions: {
      enableImplicitConversion: true, // 👈 auto-convert string -> number
    },
  }),
);

  await app.listen(3000);
}
bootstrap();