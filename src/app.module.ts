import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { PatientsModule } from './patients/patients.module';
import { User } from './auth/entities/user.entity';
import { Patient } from './patients/entities/patient.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',   // ton user PG
      password: 'ton_mdp_pg', // ton mot de passe PG
      database: 'medvault',
      entities: [User, Patient],
      synchronize: true,  // IMPORTANT
    }),
    AuthModule,
    PatientsModule,
  ],
})
export class AppModule {}
