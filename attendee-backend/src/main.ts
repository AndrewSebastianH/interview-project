import { DataSource } from 'typeorm';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { seedAdmin } from './database/seeds/admin.seed';
import { ValidationPipe } from '@nestjs/common';
import { seedEmployees } from './database/seeds/employee.seed';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });

  const dataSource = app.get(DataSource);
  const configService = app.get(ConfigService);

  await seedAdmin(dataSource, configService);
  await seedEmployees(dataSource);

  const port = configService.get<number>('PORT') || 3000;

  await app.listen(port);
  console.log(`Server running on port ${port}`);
}
bootstrap();
