import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';

/**
 * CacheControlInterceptor
 *
 * Ajoute les headers Cache-Control pour les réponses contenant des images Cloudinary
 *
 * Stratégie de cache :
 * - Images Cloudinary : Cache-Control: public, max-age=31536000, immutable
 *   (1 an de cache car les URLs incluent des transformations qui ne changent jamais)
 * - Autres réponses : pas de modification
 *
 * Usage:
 * @UseInterceptors(CacheControlInterceptor)
 * @Post('upload/ingredient-image')
 * async uploadIngredientImage() { ... }
 */
@Injectable()
export class CacheControlInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      map((data) => {
        // Vérifier si la réponse contient des URLs Cloudinary
        if (this.hasCloudinaryUrls(data)) {
          // Cache long terme pour les images Cloudinary
          // - public : peut être mis en cache par les proxies
          // - max-age=31536000 : 1 an (durée max recommandée)
          // - immutable : indique que la ressource ne changera jamais
          response.setHeader(
            'Cache-Control',
            'public, max-age=31536000, immutable'
          );
        }

        return data;
      })
    );
  }

  /**
   * Vérifie si l'objet contient des URLs Cloudinary
   */
  private hasCloudinaryUrls(obj: any): boolean {
    if (!obj) return false;

    if (typeof obj === 'string') {
      return obj.includes('cloudinary.com');
    }

    if (Array.isArray(obj)) {
      return obj.some((item) => this.hasCloudinaryUrls(item));
    }

    if (typeof obj === 'object') {
      return Object.values(obj).some((value) => this.hasCloudinaryUrls(value));
    }

    return false;
  }
}
