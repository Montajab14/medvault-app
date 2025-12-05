import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class CreatePatientDto {
  @IsObject()
  @IsNotEmpty()
  kdf: any;

  @IsString()
  @IsNotEmpty()
  nonce: string;

  @IsString()
  @IsNotEmpty()
  ciphertext: string;
}
