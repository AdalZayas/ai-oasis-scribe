import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PatientResponseDto } from './dto/patient-response.dto';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new patient' })
  @ApiBody({ type: CreatePatientDto })
  @ApiResponse({
    status: 201,
    description: 'Patient created successfully.',
    type: PatientResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Patient ID already exists',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  create(@Body() createPatientDto: CreatePatientDto) {
    return this.patientsService.create(createPatientDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all patients' })
  @ApiResponse({
    status: 200,
    description: 'List of patients retrieved successfully.',
    type: [PatientResponseDto],
  })
  @ApiResponse({
    status: 204,
    description: 'No patients found.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request.',
  })
  findAll() {
    return this.patientsService.findAll();
  }

  @Get(':mrn')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a patient by MRN' })
  @ApiResponse({
    status: 200,
    description: 'Patient retrieved successfully.',
    type: PatientResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Patient not found.',
  })
  findOne(@Param('mrn') mrn: string) {
    return this.patientsService.findOne(mrn);
  }

  @Get(':mrn/notes')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a patient by MRN with notes' })
  @ApiResponse({
    status: 200,
    description: 'Patient with notes retrieved successfully.',
    type: PatientResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Patient not found.',
  })
  findOneWithNotes(@Param('mrn') mrn: string) {
    return this.patientsService.findOneWithNotes(mrn);
  }

  @Patch(':mrn')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a patient by MRN' })
  @ApiBody({ type: UpdatePatientDto })
  @ApiResponse({
    status: 200,
    description: 'Patient updated successfully.',
    type: PatientResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Patient not found.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  update(@Param('mrn') mrn: string, @Body() updatePatientDto: UpdatePatientDto) {
    return this.patientsService.update(mrn, updatePatientDto);
  }

  @Delete(':mrn')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a patient by MRN' })
  @ApiResponse({
    status: 204,
    description: 'Patient deleted successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Patient not found.',
  })
  async remove(@Param('mrn') mrn: string) {
    await this.patientsService.remove(mrn);
  }
}
