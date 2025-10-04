import { Module } from '@nestjs/common';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { AiService } from '../ai/ai.service';

@Module({
  controllers: [NotesController],
  providers: [NotesService, AiService],
})
export class NotesModule {}
