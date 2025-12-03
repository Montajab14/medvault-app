import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PatientsModule } from './patients/patients.module';
import { User } from './auth/entities/user.entity';
import { Patient } from './patients/entities/patient.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: Number(process.env.DATABASE_PORT) || 5432,
      username: process.env.DATABASE_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'postgres',
      database: process.env.DATABASE_NAME || 'medvault',
      entities: [User, Patient],
      synchronize: true, // uniquement dev
    }),

    AuthModule,
    PatientsModule,
  ],
})
export class AppModule {}
