import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { BadRequestException } from '@nestjs/common';

const uploadPath = './uploads';
if (!existsSync(uploadPath)) {
  mkdirSync(uploadPath, { recursive: true });
}

export const multerConfig = {
  storage: diskStorage({
    destination: (req, file, cb: (error: Error | null, destination: string) => void) => {
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      const filename = `audio-${uniqueSuffix}${ext}`;
      cb(null, filename);
    },
  }),
  fileFilter: (req, file: Express.Multer.File, cb: (error: Error | null, acceptFile: boolean) => void) => {
    const allowedMimes = [
      'audio/mpeg', // mp3
      'audio/wav', // wav
      'audio/wave', // wav
      'audio/x-wav', // wav
      'audio/mp4', // m4a
      'audio/x-m4a', // m4a
      'audio/webm', // webm
      'audio/ogg', // ogg
      'audio/flac', // flac
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new BadRequestException(`Tipo de archivo no permitido: ${file.mimetype}. Usa mp3, wav, m4a, webm, ogg o flac.`),
        false,
      );
    }
  },
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB máximo
  },
};
