import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class CreatePatientDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string; 

  @IsString()
  @IsNotEmpty()
  salt: string;

  @IsString()
  @IsNotEmpty()
  encryptedData: string;
}