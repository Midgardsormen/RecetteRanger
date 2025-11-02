import { Injectable, BadRequestException } from '@nestjs/common';
import { CloudinaryService } from '../../services/cloudinary.service';

export interface ProcessedImage {
  filename: string;
  url: string;
  width: number;
  height: number;
  size: number;
}

export interface ImageProcessingOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
}

@Injectable()
export class UploadService {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  /**
   * Valide le fichier uploadé
   */
  validateImageFile(file: any): void {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Type de fichier non autorisé. Utilisez JPG, PNG ou WebP.'
      );
    }

    if (file.size > maxSize) {
      throw new BadRequestException(
        'Fichier trop volumineux. Taille maximale : 10MB.'
      );
    }
  }

  /**
   * Process une image et l'upload sur Cloudinary
   */
  async processIngredientImage(
    file: any
  ): Promise<{
    thumbnail: ProcessedImage;
    medium: ProcessedImage;
    original: ProcessedImage;
  }> {
    this.validateImageFile(file);

    try {
      // Upload l'image sur Cloudinary
      const result = await this.cloudinaryService.uploadImage(
        file,
        'recette-ranger/ingredients'
      );

      // Cloudinary permet de générer des URLs avec transformations à la volée
      const baseUrl = result.url;
      const publicId = result.publicId;

      // Construction des URLs avec transformations Cloudinary
      // Thumbnail : 200x200, crop carré
      const thumbnailUrl = baseUrl.replace(
        '/upload/',
        '/upload/w_200,h_200,c_fill,q_auto,f_auto/'
      );

      // Medium : 600x600, préserve le ratio
      const mediumUrl = baseUrl.replace(
        '/upload/',
        '/upload/w_600,h_600,c_limit,q_auto,f_auto/'
      );

      // Original optimisé : max 1200x1200
      const originalUrl = baseUrl.replace(
        '/upload/',
        '/upload/w_1200,h_1200,c_limit,q_auto:good,f_auto/'
      );

      return {
        thumbnail: {
          filename: publicId,
          url: thumbnailUrl,
          width: 200,
          height: 200,
          size: 0, // Cloudinary ne retourne pas la taille
        },
        medium: {
          filename: publicId,
          url: mediumUrl,
          width: 600,
          height: 600,
          size: 0,
        },
        original: {
          filename: publicId,
          url: originalUrl,
          width: 1200,
          height: 1200,
          size: 0,
        },
      };
    } catch (error) {
      throw new BadRequestException(
        `Erreur lors du traitement de l'image: ${error.message}`
      );
    }
  }

  /**
   * Supprime une image de Cloudinary
   */
  async deleteIngredientImage(publicId: string): Promise<void> {
    try {
      await this.cloudinaryService.deleteImage(publicId);
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'image: ${error.message}`);
    }
  }

  /**
   * Extrait le public_id depuis une URL Cloudinary
   */
  extractFilenameFromUrl(url: string): string | null {
    // Exemple URL: https://res.cloudinary.com/do835ktpq/image/upload/v123/recette-ranger/ingredients/abc123
    const match = url.match(/\/recette-ranger\/[^/]+\/([^/]+)$/);
    return match ? match[1] : null;
  }
}
