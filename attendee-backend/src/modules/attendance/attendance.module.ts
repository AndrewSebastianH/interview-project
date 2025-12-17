import { Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeModule } from '../employee/employee.module';
import { Attendance } from './attendance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Attendance]), EmployeeModule],
  providers: [AttendanceService],
  controllers: [AttendanceController],
})
export class AttendanceModule {}
