import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class CreatePatientDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  passwordHash: string; // ← Changé de password à passwordHash

  @IsString()
  @IsNotEmpty()
  salt: string;

  @IsString()
  @IsNotEmpty()
  encryptedData: string;
}