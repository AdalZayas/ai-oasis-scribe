import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { NoteResponseDto } from './dto/note-response.dto';
import { JsonValue } from '@prisma/client/runtime/client';
import { OasisExtractionResult } from '../ai/types/oasis.types';

@Injectable()
export class NotesService {
  private readonly logger = new Logger(NotesService.name);

  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}

  /**
   * Crear una nota con procesamiento de audio
   */
  async create(createNoteDto: CreateNoteDto, audioPath: string): Promise<NoteResponseDto> {
    this.logger.log(`Creating note for patient MRN: ${createNoteDto.patientMRN}`);

    // Check if patient exists
    const patient = await this.prisma.patient.findUnique({
      where: { mrn: createNoteDto.patientMRN },
    });

    if (!patient) {
      throw new NotFoundException(`Patient with MRN ${createNoteDto.patientMRN} not found`);
    }

    try {
      // Process audio with AI
      this.logger.log('Processing audio with AI...');
      const aiResult = await this.aiService.processAudioFile(audioPath);

      if (aiResult instanceof Error) {
        throw new Error(`Error processing audio: ${aiResult.message}`);
      }

      const oasisData: OasisExtractionResult = aiResult.oasisData;

      // Save note in database
      const note = await this.prisma.note.create({
        data: {
          patientMRN: createNoteDto.patientMRN,
          audioPath: audioPath,
          transcript: aiResult.transcription ?? null,
          summary: aiResult.summary ?? null,
          oasis_g: {
            M1800: oasisData.oasisData.M1800 ?? null,
            M1810: oasisData.oasisData.M1810 ?? null,
            M1820: oasisData.oasisData.M1820 ?? null,
            M1830: oasisData.oasisData.M1830 ?? null,
            M1840: oasisData.oasisData.M1840 ?? null,
            M1845: oasisData.oasisData.M1845 ?? null,
            M1850: oasisData.oasisData.M1850 ?? null,
            M1860: oasisData.oasisData.M1860 ?? null,
            confidence: oasisData.confidence ?? null,
            notes: oasisData.notes ?? null,
          },
        },
        include: {
          patient: true,
        },
      });

      this.logger.log(`Note created with ID: ${note.id}`);

      return this.mapToResponseDto({
        id: note.id,
        patientMRN: note.patientMRN,
        patient: note.patient ? { name: `${note.patient.firstName} ${note.patient.lastName}` } : undefined,
        audioPath: note.audioPath,
        transcription: note.transcript ?? null,
        summary: note.summary ?? null,
        oasisData: note.oasis_g ?? {},
        createdAt: note.createdAt,
      });
    } catch (error) {
      this.logger.error('Error processing note:', error);

      // Save note with error to not lose audio
      await this.prisma.note.create({
        data: {
          patientMRN: createNoteDto.patientMRN,
          audioPath: audioPath,
          transcript: '',
          summary: `Error processing: ${error instanceof Error ? error.message : String(error)}`,
          oasis_g: {},
        },
        include: {
          patient: true,
        },
      });

      throw error;
    }
  }

  /**
   * Obtener todas las notas
   */
  async findAll(): Promise<NoteResponseDto[]> {
    const notes = await this.prisma.note.findMany({
      include: {
        patient: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return notes.map((note) =>
      this.mapToResponseDto({
        id: note.id,
        patientMRN: note.patientMRN,
        patient: note.patient ? { name: `${note.patient.firstName} ${note.patient.lastName}` } : undefined,
        audioPath: note.audioPath,
        transcription: note.transcript ?? null,
        summary: note.summary ?? null,
        oasisData: note.oasis_g ?? {},
        createdAt: note.createdAt,
      }),
    );
  }

  /**
   * Obtener una nota por ID
   */
  async findOne(id: string): Promise<NoteResponseDto> {
    const note = await this.prisma.note.findUnique({
      where: { id },
      include: {
        patient: true,
      },
    });

    if (!note) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }

    return this.mapToResponseDto({
      id: note.id,
      patientMRN: note.patientMRN,
      patient: note.patient ? { name: `${note.patient.firstName} ${note.patient.lastName}` } : undefined,
      audioPath: note.audioPath,
      transcription: note.transcript ?? null,
      summary: note.summary ?? null,
      oasisData: note.oasis_g ?? {},
      createdAt: note.createdAt,
    });
  }

  /**
   * Obtener notas de un paciente específico
   */
  async findByPatient(patientMRN: string): Promise<NoteResponseDto[]> {
    const notes = await this.prisma.note.findMany({
      where: { patientMRN },
      include: {
        patient: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return notes.map((note) =>
      this.mapToResponseDto({
        id: note.id,
        patientMRN: note.patientMRN,
        patient: note.patient ? { name: `${note.patient.firstName} ${note.patient.lastName}` } : undefined,
        audioPath: note.audioPath,
        transcription: note.transcript ?? null,
        summary: note.summary ?? null,
        oasisData: note.oasis_g ?? {},
        createdAt: note.createdAt,
      }),
    );
  }

  /**
   * Eliminar una nota
   */
  async remove(id: string): Promise<void> {
    const note = await this.prisma.note.findUnique({
      where: { id },
    });

    if (!note) {
      throw new NotFoundException(`Nota con ID ${id} no encontrada`);
    }

    await this.prisma.note.delete({
      where: { id },
    });

    this.logger.log(`Nota ${id} eliminada`);
  }

  /**
   * Reprocesar una nota existente
   */
  async reprocess(id: string): Promise<NoteResponseDto> {
    const note = await this.prisma.note.findUnique({
      where: { id },
      include: { patient: true },
    });

    if (!note) {
      throw new NotFoundException(`Nota con ID ${id} no encontrada`);
    }

    if (!note.audioPath) {
      throw new NotFoundException('Nota no tiene audio asociado');
    }

    this.logger.log(`Reprocesando nota ${id}...`);

    try {
      const aiResult = await this.aiService.processAudioFile(note.audioPath);

      if (aiResult instanceof Error) {
        throw aiResult;
      }

      // Type guard: ensure aiResult is not an Error
      if (!aiResult || typeof aiResult !== 'object' || !('oasisData' in aiResult)) {
        throw new Error('Invalid AI result');
      }

      const oasisData: OasisExtractionResult = aiResult.oasisData;

      const updatedNote = await this.prisma.note.update({
        where: { id },
        data: {
          transcript: aiResult.transcription,
          summary: aiResult.summary,
          oasis_g: {
            M1800: oasisData.oasisData.M1800 ?? null,
            M1810: oasisData.oasisData.M1810 ?? null,
            M1820: oasisData.oasisData.M1820 ?? null,
            M1830: oasisData.oasisData.M1830 ?? null,
            M1840: oasisData.oasisData.M1840 ?? null,
            M1845: oasisData.oasisData.M1845 ?? null,
            M1850: oasisData.oasisData.M1850 ?? null,
            M1860: oasisData.oasisData.M1860 ?? null,
            confidence: oasisData.confidence ?? null,
            notes: oasisData.notes ?? null,
          },
        },
        include: {
          patient: true,
        },
      });

      this.logger.log(`✅ Nota ${id} reprocesada`);

      return this.mapToResponseDto({
        id: updatedNote.id,
        patientMRN: updatedNote.patientMRN,
        patient: updatedNote.patient
          ? {
              name: `${updatedNote.patient.firstName} ${updatedNote.patient.lastName}`,
            }
          : undefined,
        audioPath: updatedNote.audioPath,
        transcription: updatedNote.transcript ?? null,
        summary: updatedNote.summary ?? null,
        oasisData: updatedNote.oasis_g ?? {},
        createdAt: updatedNote.createdAt,
      });
    } catch (error) {
      this.logger.error(`Error reprocesando nota ${id}:`, error);
      throw error;
    }
  }

  private mapToResponseDto(note: {
    id: string;
    patientMRN: string;
    patient?: { name: string };
    audioPath: string | null;
    transcription: string | null;
    summary: string | null;
    oasisData: JsonValue;
    createdAt: Date;
  }): NoteResponseDto {
    return {
      id: note.id,
      patientMRN: note.patientMRN,
      patientName: note.patient?.name,
      audioPath: note.audioPath,
      transcription: note.transcription,
      summary: note.summary,
      oasisData: note.oasisData,
      createdAt: note.createdAt,
    };
  }

  removeAll(): Promise<void> {
    return this.prisma.note
      .deleteMany()
      .then(() => {
        this.logger.log('All notes deleted');
      })
      .catch((error) => {
        this.logger.error('Error deleting all notes:', error);
        throw error;
      });
  }
}
