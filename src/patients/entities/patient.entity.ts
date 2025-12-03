import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity()
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullname: string;

  @Column()
  age: number;

  @Column()
  symptoms: string;

  @ManyToOne(() => User, (user) => user.patients, { onDelete: 'CASCADE' })
  owner: User;
}
