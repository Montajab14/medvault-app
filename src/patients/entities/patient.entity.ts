import { User } from '../../auth/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Patient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'jsonb' })
  kdf: any;

  @Column()
  nonce: string;

  @Column()
  ciphertext: string;

  @ManyToOne(() => User, (user) => user.patients, { eager: true })
  owner: User;
}
