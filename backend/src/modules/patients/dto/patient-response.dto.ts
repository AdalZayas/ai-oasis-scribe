import { ApiProperty } from '@nestjs/swagger';

export class PatientResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the patient',
    example: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
  })
  id: string;

  @ApiProperty({
    description: 'First name of the patient',
    example: 'John',
  })
  firstName: string;

  @ApiProperty({
    description: 'Last name of the patient',
    example: 'Doe',
  })
  lastName: string;

  @ApiProperty({
    description: 'Medical record number of the patient',
    example: 'MRN123456',
  })
  mrn: string;

  @ApiProperty({
    description: 'Date of birth of the patient',
    example: '1990-01-01T00:00:00.000Z',
  })
  dob: Date;

  @ApiProperty({
    description: 'Timestamp when the patient record was created',
    example: '2023-10-01T12:34:56.789Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Number of notes associated with the patient',
    example: 5,
    required: false,
  })
  notesCount?: number;
}
