import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CloudinaryService } from '../../services/cloudinary.service';
import { logError } from '../../shared/utils/logger.util';
import {
  generateOptimizedUrl,
  ImageSize,
  AspectRatio,
} from '../../shared/utils/cloudinary-url.util';

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
  private readonly cloudName: string;

  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly configService: ConfigService,
  ) {
    this.cloudName = this.configService.get<string>('CLOUDINARY_CLOUD_NAME') || '';
  }

  /**
   * Vérifie les magic bytes pour détecter le vrai type de fichier
   * Protection contre le spoofing de mimetype
   */
  private detectMimeFromBuffer(buf: Buffer): 'image/jpeg' | 'image/png' | 'image/webp' | null {
    if (buf.length < 12) return null;

    // JPEG: FF D8 FF
    if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
      return 'image/jpeg';
    }

    // PNG: 89 50 4E 47 0D 0A 1A 0A
    const pngSig = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
    if (pngSig.every((b, i) => buf[i] === b)) {
      return 'image/png';
    }

    // WebP: "RIFF" (bytes 0..3) + "WEBP" (bytes 8..11)
    const riff = buf.toString('ascii', 0, 4);
    const webp = buf.toString('ascii', 8, 12);
    if (riff === 'RIFF' && webp === 'WEBP') {
      return 'image/webp';
    }

    return null;
  }

  /**
   * Upload une image d'ingrédient
   * La validation de taille et mimetype est faite par ParseFilePipe dans le controller
   * Ici on fait la validation magic bytes (défense en profondeur)
   */
  async uploadIngredientImage(file: Express.Multer.File): Promise<{
    thumbnail: ProcessedImage;
    medium: ProcessedImage;
    original: ProcessedImage;
  }> {
    const MAX_SIZE = 10 * 1024 * 1024;

    if (!file) {
      throw new BadRequestException('Fichier manquant.');
    }

    if (file.size > MAX_SIZE) {
      throw new BadRequestException('Fichier trop volumineux (max 10MB).');
    }

    // Validation magic bytes : vrai contenu du fichier
    const detected = this.detectMimeFromBuffer(file.buffer);
    if (!detected) {
      throw new BadRequestException('Fichier non reconnu comme une image valide.');
    }

    // Défense en profondeur : vérifier cohérence mimetype déclaré vs détecté
    if (file.mimetype !== detected) {
      throw new BadRequestException('Type de fichier invalide (mimetype falsifié).');
    }

    return this.processIngredientImage(file);
  }

  /**
   * Valide le fichier uploadé (méthode legacy, à supprimer si non utilisée ailleurs)
   * @deprecated Use uploadIngredientImage instead
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

    if (file.buffer) {
      const detectedMimeType = this.detectMimeFromBuffer(file.buffer);
      if (!detectedMimeType) {
        throw new BadRequestException(
          'Fichier invalide ou corrompu. Le contenu ne correspond pas à une image.'
        );
      }

      if (detectedMimeType !== file.mimetype) {
        throw new BadRequestException(
          `Type de fichier incohérent. Déclaré: ${file.mimetype}, Détecté: ${detectedMimeType}`
        );
      }
    }
  }

  /**
   * Process une image et l'upload sur Cloudinary
   * IMPORTANT : Cette méthode ne fait pas de validation, elle doit être appelée
   * uniquement depuis uploadIngredientImage qui fait les validations
   *
   * Stratégie d'optimisation :
   * - Utilise les tailles standardisées (320, 800, 1200) pour maximiser le cache
   * - Force f_auto,q_auto:eco pour minimiser la bande passante
   * - Aspect ratio carré (1:1) pour les ingrédients
   */
  private async processIngredientImage(
    file: any
  ): Promise<{
    thumbnail: ProcessedImage;
    medium: ProcessedImage;
    original: ProcessedImage;
  }> {
    try {
      // Upload l'image sur Cloudinary (format JPG forcé dans CloudinaryService)
      const result = await this.cloudinaryService.uploadImage(
        file,
        'recette-ranger/ingredients'
      );

      const publicId = result.publicId;

      // Génération des URLs optimisées avec les tailles standardisées
      // Thumbnail : 320x320 (SMALL) - pour les listes
      const thumbnailUrl = generateOptimizedUrl(
        publicId,
        {
          width: ImageSize.SMALL,
          aspectRatio: AspectRatio.SQUARE,
        },
        this.cloudName
      );

      // Medium : 800x800 (LARGE) - pour les vues détaillées
      const mediumUrl = generateOptimizedUrl(
        publicId,
        {
          width: ImageSize.LARGE,
          aspectRatio: AspectRatio.SQUARE,
        },
        this.cloudName
      );

      // Original optimisé : 1200x1200 (XLARGE) - taille max
      const originalUrl = generateOptimizedUrl(
        publicId,
        {
          width: ImageSize.XLARGE,
          aspectRatio: AspectRatio.SQUARE,
        },
        this.cloudName
      );

      return {
        thumbnail: {
          filename: publicId,
          url: thumbnailUrl,
          width: ImageSize.SMALL,
          height: ImageSize.SMALL,
          size: 0, // Cloudinary ne retourne pas la taille
        },
        medium: {
          filename: publicId,
          url: mediumUrl,
          width: ImageSize.LARGE,
          height: ImageSize.LARGE,
          size: 0,
        },
        original: {
          filename: publicId,
          url: originalUrl,
          width: ImageSize.XLARGE,
          height: ImageSize.XLARGE,
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
   * Note: Cette opération est "best effort" - les erreurs sont loggées mais pas relancées
   * car la suppression d'image est généralement une opération de nettoyage non-critique
   */
  async deleteIngredientImage(publicId: string): Promise<void> {
    try {
      await this.cloudinaryService.deleteImage(publicId);
    } catch (error) {
      // Log mais ne rethrow pas : la suppression d'image est best-effort
      logError('Erreur lors de la suppression de l\'image', error);
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
