import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Employee } from '../employee/employee.entity';

@Entity()
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Employee, (employee) => employee.attendances, {
    eager: true,
  })
  employee: Employee;

  @Column({ type: 'datetime' })
  clockIn: Date;

  @Column({ type: 'datetime', nullable: true })
  clockOut: Date;

  @Column({ nullable: true })
  pictureUrl: string;

  @CreateDateColumn()
  createdAt: Date;
}
