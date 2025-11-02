import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UploadService } from './upload.service';

@Controller('api/upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('ingredient-image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadIngredientImage(
    @UploadedFile() file: any
  ) {
    if (!file) {
      throw new BadRequestException('Aucun fichier fourni');
    }

    const result = await this.uploadService.processIngredientImage(file);

    return {
      message: 'Image uploadée et traitée avec succès',
      ...result,
    };
  }
}
