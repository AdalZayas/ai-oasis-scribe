import { ApiProperty } from '@nestjs/swagger';

export class OasisDataDto {
  @ApiProperty({ example: 0, description: 'Grooming (0-3)' })
  M1800: number;

  @ApiProperty({ example: 1, description: 'Dress Upper Body (0-3)' })
  M1810: number;

  @ApiProperty({ example: 2, description: 'Dress Lower Body (0-3)' })
  M1820: number;

  @ApiProperty({ example: 1, description: 'Bathing (0-4)' })
  M1830: number;

  @ApiProperty({ example: 1, description: 'Toilet Transferring (0-4)' })
  M1840: number;

  @ApiProperty({ example: 0, description: 'Transferring (0-4)' })
  M1850: number;

  @ApiProperty({ example: 0, description: 'Ambulation/Locomotion (0-5)' })
  M1860: number;
}

export class NoteResponseDto {
  @ApiProperty({ example: 1 })
  id: string;

  @ApiProperty({ example: 1 })
  patientMRN: string;

  @ApiProperty({
    example: 'María García López',
    description: 'Nombre del paciente',
  })
  patientName?: string;

  @ApiProperty({
    example: '/uploads/audio-123456.mp3',
    nullable: true,
  })
  audioPath: string | null;

  @ApiProperty({
    example: 'Audion transcription text...',
    nullable: true,
  })
  transcription: string | null;

  @ApiProperty({
    example: 'Patient shows improvement in mobility ...',
    nullable: true,
  })
  summary: string | null;

  @ApiProperty({
    type: OasisDataDto,
    nullable: true,
  })
  oasisData: any;

  @ApiProperty({ example: '2025-09-30T12:00:00.000Z' })
  createdAt: Date;
}
