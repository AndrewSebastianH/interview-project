import { DataSource } from 'typeorm';
import { Attendance } from '../../modules/attendance/attendance.entity';
import { Employee, Role } from '../../modules/employee/employee.entity';
import { Logger } from '@nestjs/common';

export async function seedAttendance(dataSource: DataSource) {
  const logger = new Logger('SeedAttendance');
  const attendanceRepo = dataSource.getRepository(Attendance);
  const employeeRepo = dataSource.getRepository(Employee);

  const employees = await employeeRepo.find({
    where: { role: Role.EMPLOYEE },
  });

  if (employees.length === 0) {
    logger.warn('No employees found, skipping attendance seeding');
    return;
  }

  const demoImages = [
    'uploads/attendance/demo-1.jpg',
    'uploads/attendance/demo-2.jpg',
    'uploads/attendance/demo-3.png',
  ];

  const attendances: Attendance[] = [];

  for (const employee of employees) {
    for (let dayOffset = 1; dayOffset <= 30; dayOffset++) {
      // Skip some days to look realistic
      if (Math.random() < 0.3) continue;

      const date = new Date();
      date.setDate(date.getDate() - dayOffset);

      // Clock in between 08:00–09:30
      const clockIn = new Date(date);
      clockIn.setHours(8, Math.floor(Math.random() * 90), 0);

      // Clock out after 7–9 hours
      const clockOut = new Date(clockIn);
      clockOut.setHours(
        clockOut.getHours() + 7 + Math.floor(Math.random() * 3),
      );

      attendances.push(
        attendanceRepo.create({
          employee,
          clockIn,
          clockOut,
          pictureUrl: demoImages[Math.floor(Math.random() * demoImages.length)],
        }),
      );
    }
  }

  try {
    await attendanceRepo.save(attendances);
    logger.log(`Seeded ${attendances.length} attendance records`);
  } catch (error) {
    logger.error('Attendance seeding failed', error);
  }
}
