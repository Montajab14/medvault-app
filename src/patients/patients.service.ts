import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './entities/patient.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private patientRepo: Repository<Patient>,
  ) {}

  async create(dto: CreatePatientDto, user: User) {
    const patient = this.patientRepo.create({
      kdf: dto.kdf,
      nonce: dto.nonce,
      ciphertext: dto.ciphertext,
      owner: user,
    });

    return this.patientRepo.save(patient);
  }

  async getMine(user: User) {
    return this.patientRepo.find({
      where: { owner: { id: user.id } },
    });
  }
}
