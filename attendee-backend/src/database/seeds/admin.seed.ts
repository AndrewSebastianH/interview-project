import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Employee, Role } from '../../modules/employee/employee.entity';
import { ConfigService } from '@nestjs/config';

import { Logger } from '@nestjs/common';

export async function seedAdmin(dataSource: DataSource, config: ConfigService) {
  const repo = dataSource.getRepository(Employee);
  const logger = new Logger('SeedAdmin');

  const email = config.get<string>('ADMIN_EMAIL');
  const password = config.get<string>('ADMIN_PASSWORD');

  if (!email || !password) {
    throw new Error('ADMIN_EMAIL or ADMIN_PASSWORD not set');
  }

  const exists = await repo.findOne({
    where: { email: config.get<string>('ADMIN_EMAIL') },
  });

  if (exists) {
    logger.log('Admin account found, skip seeding process');
    return;
  }

  const admin = repo.create({
    email: config.get<string>('ADMIN_EMAIL'),
    name: 'HR Admin',
    password: await bcrypt.hash(config.get<string>('ADMIN_PASSWORD'), 10),
    role: Role.HR,
  });

  try {
    await repo.save(admin);
    logger.log('Admin account seeded');
  } catch (error) {
    logger.error('Admin account seeding failed');
  }
}
