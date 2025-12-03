import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreatePatientDto, @Req() req) {
    return this.patientsService.create(dto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getMine(@Req() req) {
    return this.patientsService.getMine(req.user);
  }
}
