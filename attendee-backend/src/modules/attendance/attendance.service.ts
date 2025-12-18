import { AttendanceQueryDto } from './dto/attendance-query.dto';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Between, Not } from 'typeorm';
import { Employee, Role } from '../employee/employee.entity';
import { Attendance } from './attendance.entity';
import getMonthRange from 'src/helpers/getMonthrange';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepo: Repository<Attendance>,
    @InjectRepository(Employee)
    private readonly employeeRepo: Repository<Employee>,
  ) {}

  // Clock in
  async clockIn(user: { userId: number; role: string }) {
    const employee = await this.employeeRepo.findOne({
      where: { id: user.userId },
    });

    if (!employee) throw new NotFoundException('Employee not found');

    if (employee.role === Role.HR)
      throw new ForbiddenException('HR cannot clock in');

    const openAttendance = await this.attendanceRepo.findOne({
      where: { employee: { id: employee.id }, clockOut: IsNull() },
    });

    if (openAttendance) throw new BadRequestException('Already clocked in');

    const attendance = this.attendanceRepo.create({
      employee,
      clockIn: new Date(),
    });

    return this.attendanceRepo.save(attendance);
  }

  // Is Clocked In
  async isClockedIn(user: { userId: number; role: string }) {
    const employee = await this.employeeRepo.findOne({
      where: { id: user.userId },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    if (employee.role === Role.HR) {
      throw new ForbiddenException('HR cannot have attendance records');
    }

    const openAttendance = await this.attendanceRepo.findOne({
      where: {
        employee: { id: employee.id },
        clockOut: IsNull(),
      },
    });

    if (!openAttendance) {
      return {
        isClockedIn: false,
      };
    }

    const now = new Date().getTime();
    const clockInTime = new Date(openAttendance.clockIn).getTime();
    const workedSeconds = Math.floor((now - clockInTime) / 1000);

    return {
      isClockedIn: true,
      attendanceId: openAttendance.id,
      clockInTime: openAttendance.clockIn,
      workedSeconds,
    };
  }

  // Clock out
  async clockOut(user: { userId: number; role: string }) {
    const employee = await this.employeeRepo.findOne({
      where: { id: user.userId },
    });

    if (!employee) throw new NotFoundException('Employee not found');
    if (employee.role === Role.HR)
      throw new ForbiddenException('HR cannot clock out');

    const attendance = await this.attendanceRepo.findOne({
      where: { employee: { id: employee.id }, clockOut: IsNull() },
    });

    if (!attendance) throw new NotFoundException('No active attendance found');

    attendance.clockOut = new Date();
    return this.attendanceRepo.save(attendance);
  }

  // Upload proof
  async attachProof(attendanceId: number, imagePath: string) {
    const attendance = await this.attendanceRepo.findOne({
      where: { id: attendanceId },
      relations: ['employee'],
    });

    if (!attendance) {
      throw new NotFoundException('Attendance not found');
    }

    const normalizedPath = imagePath
      .replace(/\\/g, '/')
      .replace(/^uploads\//, '');

    attendance.pictureUrl = `/uploads/${normalizedPath}`;

    return this.attendanceRepo.save(attendance);
  }

  async findAllAttendances(query: AttendanceQueryDto) {
    const { page = 1, pageSize = 5, search, date } = query;
    const targetDate = date ? new Date(date) : new Date();
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const qb = this.attendanceRepo
      .createQueryBuilder('attendance')
      .leftJoinAndSelect('attendance.employee', 'employee')
      .where('attendance.clockIn BETWEEN :start AND :end', {
        start: startOfDay,
        end: endOfDay,
      })
      .andWhere('employee.role = :role', { role: Role.EMPLOYEE })
      .orderBy('attendance.clockIn', 'DESC');

    if (search) {
      qb.andWhere(
        '(employee.name LIKE :search OR employee.email LIKE :search)',
        { search: `%${search}%` },
      );
    }

    const [data, total] = await qb
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return {
      data: data.map((a) => ({
        id: a.id,
        date: a.clockIn.toISOString().split('T')[0],
        clockIn: a.clockIn,
        clockOut: a.clockOut,
        pictureUrl: a.pictureUrl,
        employee: {
          id: a.employee.id,
          name: a.employee.name,
          email: a.employee.email,
        },
      })),
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  async getMonthlyInsights(
    user: { userId: number; role: string },
    month?: string,
  ) {
    if (user.role === Role.HR) {
      throw new ForbiddenException('HR has no attendance insights');
    }

    const employee = await this.employeeRepo.findOne({
      where: { id: user.userId },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    const { start, end } = getMonthRange(month);

    const attendances = await this.attendanceRepo.find({
      where: {
        employee: { id: employee.id },
        clockIn: Between(start, end),
        clockOut: Not(IsNull()),
      },
    });

    let totalWorkedSeconds = 0;
    let lateArrivals = 0;

    for (const att of attendances) {
      const diffMs =
        new Date(att.clockOut).getTime() - new Date(att.clockIn).getTime();

      totalWorkedSeconds += Math.floor(diffMs / 1000);

      const clockInDate = new Date(att.clockIn);
      const workStart = new Date(att.clockIn);

      workStart.setHours(9, 0, 0, 0);

      if (clockInDate > workStart) {
        lateArrivals++;
      }
    }

    return {
      month:
        month ??
        `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}`,
      totalWorkedSeconds,
      daysClockedIn: attendances.length,
      lateArrivals,
    };
  }
}
