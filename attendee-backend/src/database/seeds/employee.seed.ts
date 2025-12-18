import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Employee, Role } from '../../modules/employee/employee.entity';
import { Logger } from '@nestjs/common';

export async function seedEmployees(dataSource: DataSource) {
  const repo = dataSource.getRepository(Employee);
  const logger = new Logger('SeedEmployees');

  // Check if employees already exist (excluding HR)
  const existingCount = await repo.count({
    where: { role: Role.EMPLOYEE },
  });

  if (existingCount > 0) {
    logger.log('Employees already exist, skipping seeding');
    return;
  }

  const passwordHash = await bcrypt.hash('123123', 10);

  const employees: Employee[] = [];

  for (let i = 1; i <= 20; i++) {
    employees.push(
      repo.create({
        name: `Employee ${i}`,
        email: `employee${i}@demo.com`,
        password: passwordHash,
        role: Role.EMPLOYEE,
      }),
    );
  }

  try {
    await repo.save(employees);
    logger.log('20 demo employees seeded successfully');
  } catch (error) {
    logger.error('Employee seeding failed', error);
  }
}
