import { AttendanceQueryDto } from './dto/attendance-query.dto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Employee } from '../employee/employee.entity';
import { Attendance } from './attendance.entity';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepo: Repository<Attendance>,
  ) {}

  // Clock in
  async clockIn(employee: Employee) {
    const openAttendance = await this.attendanceRepo.findOne({
      where: {
        employee: { id: employee.id },
        clockOut: IsNull(),
      },
    });

    if (openAttendance) {
      throw new BadRequestException('Already clocked in');
    }

    const attendance = this.attendanceRepo.create({
      employee,
      clockIn: new Date(),
    });

    return this.attendanceRepo.save(attendance);
  }

  // Upload proof
  async attachProof(attendanceId: number, imagePath: string) {
    const attendance = await this.attendanceRepo.findOne({
      where: { id: attendanceId },
    });

    if (!attendance) {
      throw new NotFoundException('Attendance not found');
    }

    attendance.pictureUrl = imagePath;
    return this.attendanceRepo.save(attendance);
  }

  // Clock out
  async clockOut(employee: Employee) {
    const attendance = await this.attendanceRepo.findOne({
      where: {
        employee: { id: employee.id },
        clockOut: IsNull(),
      },
    });

    if (!attendance) {
      throw new NotFoundException('No active attendance found');
    }

    attendance.clockOut = new Date();
    return this.attendanceRepo.save(attendance);
  }

  async findAllTodayPaginated(query: AttendanceQueryDto) {
    const { page = 1, pageSize = 5, search, date } = query;

    // Default = today
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
}
