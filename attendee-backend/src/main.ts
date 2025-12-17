import { DataSource } from 'typeorm';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { seedAdmin } from './database/seeds/admin.seed';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });

  const dataSource = app.get(DataSource);
  const configService = app.get(ConfigService);

  await seedAdmin(dataSource, configService);

  const port = configService.get<number>('PORT') || 3000;

  await app.listen(port);
  console.log(`Server running on port ${port}`);
}
bootstrap();
