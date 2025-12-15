import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Patient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  // Hash Argon2 du password (pour authentification uniquement)
  @Column()
  passwordHash: string;

  // Salt pour dériver la Master Key côté client (Base64)
  @Column()
  salt: string;

  // Données médicales chiffrées en AES-GCM (Base64)
  // Contient : { nom, prenom, age, symptomes }
  @Column('text')
  encryptedData: string;

  @CreateDateColumn()
  createdAt: Date;
}