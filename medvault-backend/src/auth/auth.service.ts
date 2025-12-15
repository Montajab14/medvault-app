import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PatientService } from '../patient/patient.service';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private patientService: PatientService,
    private jwtService: JwtService,
  ) {}

  async register(payload: {
    email: string;
    password: string;
    salt: string;
    encryptedData: string;
  }) {
    const existing = await this.patientService.findByEmail(payload.email);
    if (existing) {
      throw new ConflictException('Email déjà utilisé');
    }

    // Hash du password avec Argon2 côté serveur
    const passwordHash = await argon2.hash(payload.password);

    const patient = await this.patientService.create({
      email: payload.email,
      passwordHash,
      salt: payload.salt,
      encryptedData: payload.encryptedData,
    });

    return {
      message: 'Patient enregistré avec succès',
      patientId: patient.id,
    };
  }

  async login(payload: { email: string; password: string }) {
    const patient = await this.patientService.findByEmail(payload.email);
    if (!patient) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    // Vérification du password avec Argon2
    const valid = await argon2.verify(patient.passwordHash, payload.password);
    if (!valid) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    const accessToken = this.jwtService.sign({ 
      sub: patient.id, 
      email: patient.email 
    });

    return {
      access_token: accessToken,
      salt: patient.salt,
      encryptedData: patient.encryptedData,
    };
  }
}