import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Employee, Role, SafeEmployee } from './employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeeQueryDto } from './dto/employee-query.dto';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepo: Repository<Employee>,
  ) {}

  // CREATE (HR only)
  async create(dto: CreateEmployeeDto): Promise<SafeEmployee> {
    const existing = await this.employeeRepo.findOne({
      where: { email: dto.email },
    });

    if (existing) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const employee = this.employeeRepo.create({
      email: dto.email,
      name: dto.name,
      password: hashedPassword,
      role: dto.role ?? Role.EMPLOYEE,
    });

    const saved = await this.employeeRepo.save(employee);

    const { password, ...safeEmployee } = saved;
    return safeEmployee;
  }

  async findAllPaginated(query: EmployeeQueryDto) {
    const { page = 1, pageSize = 5, search } = query;

    const qb = this.employeeRepo
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.attendances', 'attendance')
      .orderBy('attendance.createdAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize);

    if (search) {
      qb.andWhere(
        '(employee.name LIKE :search OR employee.email LIKE :search)',
        { search: `%${search}%` },
      );
    }

    const [employees, total] = await qb.getManyAndCount();

    const data = employees.map((emp) => ({
      id: emp.id,
      name: emp.name,
      email: emp.email,
      attendance: emp.attendances
        ?.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 3)
        .map((a) => ({
          date: a.createdAt,
          clockIn: a.clockIn,
          clockOut: a.clockOut,
        })),
    }));

    return {
      data,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  // READ ALL (HR only)
  async findAll(): Promise<Employee[]> {
    return this.employeeRepo.find({
      select: ['id', 'name', 'email', 'role'],
    });
  }

  // READ ONE (self / HR)
  async findOne(id: number): Promise<Employee> {
    const employee = await this.employeeRepo.findOne({
      where: { id },
      select: ['id', 'name', 'email', 'role'],
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    return employee;
  }

  // UPDATE (HR only)
  async update(id: number, dto: UpdateEmployeeDto): Promise<SafeEmployee> {
    const employee = await this.employeeRepo.findOne({
      where: { id },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    Object.assign(employee, dto);
    const updated = await this.employeeRepo.save(employee);

    const { password, ...safeEmployee } = updated;
    return safeEmployee;
  }

  // DELETE (HR only)
  async remove(id: number): Promise<void> {
    const employee = await this.employeeRepo.findOne({
      where: { id },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    await this.employeeRepo.remove(employee);
  }

  // AUTH SUPPORT (Login)
  async findByEmail(email: string): Promise<Employee | null> {
    return this.employeeRepo.findOne({
      where: { email },
    });
  }
}
