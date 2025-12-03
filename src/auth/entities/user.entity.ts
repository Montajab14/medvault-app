import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Patient } from '../../patients/entities/patient.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string; // Hashé + salé

  @OneToMany(() => Patient, (patient) => patient.owner)
  patients: Patient[];

}
