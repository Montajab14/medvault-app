import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PatientService } from '../patient/patient.service';

@Injectable()
export class AuthService {
  constructor(
    private patientService: PatientService,
    private jwtService: JwtService,
  ) {}

  async register(payload: {
    email: string;
    passwordHash: string;
    salt: string;
    encryptedData: string;
  }) {
    const existing = await this.patientService.findByEmail(payload.email);
    if (existing) {
      throw new ConflictException('Email déjà utilisé');
    }

    // Le passwordHash est déjà hashé côté frontend
    // On le stocke directement
    const patient = await this.patientService.create({
      email: payload.email,
      passwordHash: payload.passwordHash,
      salt: payload.salt,
      encryptedData: payload.encryptedData,
    });

    return {
      message: 'Patient enregistré avec succès',
      patientId: patient.id,
    };
  }

  async login(payload: { email: string; passwordHash: string }) {
    const patient = await this.patientService.findByEmail(payload.email);
    if (!patient) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    // Comparaison directe des hashs
    if (patient.passwordHash !== payload.passwordHash) {
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