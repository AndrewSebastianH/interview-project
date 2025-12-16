import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Attendance } from '../attendance/attendance.entity';

export enum Role {
  HR = 'HR',
  EMPLOYEE = 'Employee',
}

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.EMPLOYEE })
  role: Role;

  @OneToMany(() => Attendance, (attendance) => attendance.employee)
  attendances: Attendance[];
}
