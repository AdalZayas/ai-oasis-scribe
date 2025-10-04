import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class CreatePatientDto {
  @ApiProperty({
    description: 'First name of the patient',
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'Last name of the patient',
    example: 'Doe',
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: 'Medical record number of the patient',
    example: 'MRN123456',
  })
  @IsString()
  @IsNotEmpty()
  mrn: string;

  @ApiProperty({
    description: 'Date of birth of the patient',
    example: '1990-01-01',
  })
  @IsDateString()
  @IsNotEmpty()
  dob: string;
}
