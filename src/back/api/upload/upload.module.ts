import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { CloudinaryService } from '../../services/cloudinary.service';
import { ConfigModule } from '@nestjs/config';
import { memoryStorage } from 'multer';

@Module({
  imports: [
    ConfigModule,
    // Configuration Multer : limites volumétriques pour bloquer les abus
    // La validation métier (type, magic bytes) se fait dans ParseFilePipe + Service
    MulterModule.register({
      storage: memoryStorage(),
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB max
        files: 1,                   // 1 fichier par requête max
        fields: 10,                 // Limite le nombre de champs non-file
        parts: 20,                  // Limite le nombre total de parties multipart
      },
      // Plus de fileFilter : on laisse Multer capter le fichier,
      // puis on valide avec ParseFilePipe (→ 400 propres au lieu de 500)
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService, CloudinaryService],
  exports: [UploadService],
})
export class UploadModule {}
