import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateNoteDto {
  @ApiProperty({
    description: 'ID del paciente',
    example: 1,
    type: 'integer',
  })
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  patientMRN: string;
}
