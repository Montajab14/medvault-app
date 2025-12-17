import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class LoginPatientDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  passwordHash: string; 
}