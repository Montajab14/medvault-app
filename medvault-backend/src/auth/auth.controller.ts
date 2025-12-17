import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginPatientDto } from '../patient/dto/login-patient.dto';
import { CreatePatientDto } from '../patient/dto/create-patient.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: CreatePatientDto) {
    return this.authService.register({
      email: dto.email,
      passwordHash: dto.passwordHash, 
      salt: dto.salt,
      encryptedData: dto.encryptedData,
    });
  }

  @Post('login')
  async login(@Body() dto: LoginPatientDto) {
    return this.authService.login({
      email: dto.email,
      passwordHash: dto.passwordHash, 
    });
  }
}