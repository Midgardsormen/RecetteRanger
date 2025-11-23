import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UploadService } from './upload.service';

@Controller('api/upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('ingredient-image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadIngredientImage(
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: true,
        validators: [
          // Validation 1: Taille max 10MB
          new MaxFileSizeValidator({
            maxSize: 10 * 1024 * 1024,
          }),
          // Validation 2: Type de fichier (mimetype complet, pas "image/*")
          new FileTypeValidator({
            fileType: /^image\/(jpeg|png|webp)$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    // Validation 3: Magic bytes + traitement
    const result = await this.uploadService.uploadIngredientImage(file);

    return {
      message: 'Image uploadée et traitée avec succès',
      ...result,
    };
  }
}
