import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreatePatientDto {
  @IsString()
  @IsNotEmpty()
  fullname: string;

  @IsNumber()
  age: number;

  @IsString()
  @IsNotEmpty()
  symptoms: string;
}
