import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody, ApiParam } from '@nestjs/swagger';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { NoteResponseDto } from './dto/note-response.dto';
import { multerConfig } from '../../config/multer.config';
import { AiService } from '../ai/ai.service';

@ApiTags('notes')
@Controller('notes')
export class NotesController {
  private readonly logger = new Logger(NotesService.name);

  constructor(
    private readonly notesService: NotesService,
    private readonly aiService: AiService,
  ) {
    this.logger.log('NotesController initialized');
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('audio', multerConfig))
  @ApiOperation({ summary: 'Upload audio and create OASIS note' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Audio audio and patient MRN',
    schema: {
      type: 'object',
      required: ['audio', 'patientMRN'],
      properties: {
        patientMRN: {
          type: 'integer',
          example: 1,
          description: 'Patient MRN',
        },
        audio: {
          type: 'string',
          format: 'binary',
          description: 'Audio audio (mp3, wav, m4a, etc.)',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Note created and processed successfully',
    type: NoteResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data or file',
  })
  @ApiResponse({
    status: 404,
    description: 'Patient not found',
  })
  async create(@Body() createNoteDto: CreateNoteDto, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Audio file is required');
    }
    this.logger.log(`Uploaded file path: ${file.path}`);
    return this.notesService.create(createNoteDto, file.path);
  }

  @Get()
  @ApiOperation({ summary: 'Get all notes' })
  @ApiResponse({
    status: 200,
    description: 'List of notes',
    type: [NoteResponseDto],
  })
  findAll() {
    return this.notesService.findAll();
  }

  @Get(':id/find')
  @ApiOperation({ summary: 'Get a note by ID' })
  @ApiParam({ name: 'id', description: 'Note ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Note found',
    type: NoteResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Note not found',
  })
  findOne(@Param('id') id: string) {
    return this.notesService.findOne(id);
  }

  @Get('patient/:patientMRN')
  @ApiOperation({ summary: 'Get all notes for a patient' })
  @ApiParam({ name: 'patientMRN', description: 'Patient MRN', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Patient notes',
    type: [NoteResponseDto],
  })
  findByPatient(@Param('patientMRN') patientMRN: string) {
    return this.notesService.findByPatient(patientMRN);
  }

  @Post(':id/reprocess')
  @ApiOperation({ summary: 'Reprocess an existing note with AI' })
  @ApiParam({ name: 'id', description: 'Note ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Note reprocessed successfully',
    type: NoteResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Note not found or missing audio',
  })
  reprocess(@Param('id') id: string) {
    return this.notesService.reprocess(id);
  }

  @Delete(':id/remove')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a note' })
  @ApiParam({ name: 'id', description: 'Note ID', example: 1 })
  @ApiResponse({
    status: 204,
    description: 'Note deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Note not found',
  })
  async remove(@Param('id') id: string) {
    await this.notesService.remove(id);
  }

  @Delete('remove-all')
  @ApiOperation({ summary: 'Delete all notes' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeAll() {
    await this.notesService.removeAll();
  }

  @Get('health')
  @ApiOperation({ summary: 'Check AI services health status' })
  @ApiResponse({
    status: 200,
    description: 'Health status of Whisper and Ollama',
    schema: {
      example: {
        whisper: true,
        ollama: true,
        models: ['llama3.1'],
      },
    },
  })
  async healthCheck() {
    return this.aiService.healthCheck();
  }
}
