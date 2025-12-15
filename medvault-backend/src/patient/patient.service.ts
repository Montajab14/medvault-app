import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './patient.entity';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
  ) {}

  async create(data: {
    email: string;
    passwordHash: string;
    salt: string;
    encryptedData: string;
  }): Promise<Patient> {
    const patient = this.patientRepository.create(data);
    return this.patientRepository.save(patient);
  }

  async findByEmail(email: string): Promise<Patient | null> {
    return this.patientRepository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<Patient | null> {
    return this.patientRepository.findOne({ where: { id } });
  }

  async updateEncryptedData(
    id: number,
    encryptedData: string,
  ): Promise<void> {
    await this.patientRepository.update(id, { encryptedData });
  }
}