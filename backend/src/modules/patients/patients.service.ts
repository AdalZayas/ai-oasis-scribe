import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PatientResponseDto } from './dto/patient-response.dto';

@Injectable()
export class PatientsService {
  constructor(private prisma: PrismaService) {}

  async create(createPatientDto: CreatePatientDto): Promise<PatientResponseDto> {
    // Verificar si el patientId ya existe
    const existingPatient = await this.prisma.patient.findUnique({
      where: { mrn: createPatientDto.mrn },
    });

    if (existingPatient) {
      throw new ConflictException(`Patient with MRN ${createPatientDto.mrn} already exists`);
    }

    const patient = await this.prisma.patient.create({
      data: {
        mrn: createPatientDto.mrn,
        firstName: createPatientDto.firstName,
        lastName: createPatientDto.lastName,
        dob: new Date(createPatientDto.dob),
      },
    });

    return this.mapToResponseDto(patient);
  }

  async findAll(): Promise<PatientResponseDto[]> {
    const patients = await this.prisma.patient.findMany({
      include: {
        _count: {
          select: { notes: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return patients.map((patient) => ({
      ...this.mapToResponseDto(patient),
      notesCount: patient._count.notes,
    }));
  }

  async findOne(mrn: string): Promise<PatientResponseDto> {
    const patient = await this.prisma.patient.findUnique({
      where: { mrn },
      include: {
        _count: {
          select: { notes: true },
        },
      },
    });

    if (!patient) {
      throw new NotFoundException(`Patient with MRN ${mrn} not found`);
    }

    return {
      ...this.mapToResponseDto(patient),
      notesCount: patient._count.notes,
    };
  }

  async findOneWithNotes(mrn: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { mrn },
      include: {
        notes: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!patient) {
      throw new NotFoundException(`Patient with MRN ${mrn} not found`);
    }

    return patient;
  }

  async update(mrn: string, updatePatientDto: UpdatePatientDto): Promise<PatientResponseDto> {
    // Verificar que el paciente existe
    await this.findOne(mrn);

    // Si se está actualizando el patientId, verificar que no exista
    if (updatePatientDto.mrn) {
      const existing = await this.prisma.patient.findUnique({
        where: { mrn: updatePatientDto.mrn },
      });

      if (existing && existing.mrn !== mrn) {
        throw new ConflictException(`Patient MRN ${updatePatientDto.mrn} is already in use`);
      }
    }

    const data = { ...updatePatientDto };
    if (updatePatientDto.dob) {
      data.dob = new Date(updatePatientDto.dob).toISOString();
    }

    const patient = await this.prisma.patient.update({
      where: { mrn },
      data,
    });

    return this.mapToResponseDto(patient);
  }

  async remove(mrn: string): Promise<void> {
    await this.findOne(mrn);

    // Prisma eliminará las notas automáticamente si configuramos onDelete: Cascade
    // Por ahora, verificamos que no haya notas
    const patient = await this.prisma.patient.findUnique({
      where: { mrn },
      include: { _count: { select: { notes: true } } },
    });

    if (patient && patient._count.notes > 0) {
      throw new ConflictException(
        `Cannot delete patient with existing notes. Please delete ${patient._count.notes} note(s) first.`,
      );
    }

    await this.prisma.patient.delete({
      where: { mrn },
    });
  }

  private mapToResponseDto(patient: {
    id: string;
    mrn: string;
    firstName: string;
    lastName: string;
    dob: Date;
    createdAt: Date;
  }): PatientResponseDto {
    return {
      id: patient.id,
      mrn: patient.mrn,
      firstName: patient.firstName,
      lastName: patient.lastName,
      dob: patient.dob,
      createdAt: patient.createdAt,
    };
  }
}
