import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity()
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  age: number;

  @Column()
  medical_info: string;

  // Relation sécurisée
  @ManyToOne(() => User, user => user.patients, { onDelete: 'CASCADE' })
  doctor: User;

  @Column()
  doctorId: string; // Obligatoire pour RLS
}
