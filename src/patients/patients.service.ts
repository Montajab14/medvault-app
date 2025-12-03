import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Patient } from './entities/patient.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private patientRepo: Repository<Patient>,

    private dataSource: DataSource, 
  ) {}

  async create(dto: CreatePatientDto, user: User) {
    await this.dataSource.query(
      `SET app.current_user_id = '${user.id}';`,
    );

    const patient = this.patientRepo.create({
      ...dto,
      owner: user,
    });

    return this.patientRepo.save(patient);
  }

  async getMine(user: User) {
    await this.dataSource.query(
      `SET app.current_user_id = '${user.id}';`,
    );

    return this.patientRepo.find();
  }
}
