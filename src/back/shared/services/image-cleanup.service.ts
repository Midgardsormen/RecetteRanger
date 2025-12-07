import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
import { CloudinaryService } from '../../services/cloudinary.service';
// import { Ingredient } from '../../modules/ingredients/ingredient.entity';
// import { Recipe } from '../../modules/recettes/recipe.entity';
import { extractPublicId } from '../utils/cloudinary-url.util';
import { logError } from '../utils/logger.util';

// Fonction helper pour les logs info
function logInfo(message: string): void {
  if (process.env.NODE_ENV !== 'production') {
    console.log(message);
  }
}

/**
 * ImageCleanupService
 *
 * Service de nettoyage des images orphelines sur Cloudinary
 *
 * Stratégie :
 * 1. Récupère toutes les images référencées en base de données
 * 2. Liste toutes les images sur Cloudinary dans le dossier recette-ranger
 * 3. Identifie les images orphelines (sur Cloudinary mais pas en BDD)
 * 4. Supprime les images orphelines plus anciennes que X jours
 *
 * Usage :
 * - Lancer manuellement via un endpoint admin
 * - Ou via une tâche CRON (à implémenter)
 */
@Injectable()
export class ImageCleanupService {
  constructor(
    // @InjectRepository(Ingredient)
    // private ingredientRepository: Repository<Ingredient>,
    // @InjectRepository(Recipe)
    // private recipeRepository: Repository<Recipe>,
    private cloudinaryService: CloudinaryService,
  ) {}

  /**
   * Récupère tous les public_ids référencés en base de données
   *
   * TODO: Implémenter avec Prisma au lieu de TypeORM
   */
  private async getReferencedPublicIds(): Promise<Set<string>> {
    const publicIds = new Set<string>();

    // TODO: Remplacer par des appels Prisma
    // const ingredients = await this.prisma.ingredient.findMany({
    //   select: { imageUrl: true },
    //   where: { imageUrl: { not: null } },
    // });
    //
    // for (const ingredient of ingredients) {
    //   if (ingredient.imageUrl) {
    //     const publicId = extractPublicId(ingredient.imageUrl);
    //     if (publicId) {
    //       publicIds.add(publicId);
    //     }
    //   }
    // }
    //
    // const recipes = await this.prisma.recipe.findMany({
    //   select: { imageUrl: true },
    //   where: { imageUrl: { not: null } },
    // });
    //
    // for (const recipe of recipes) {
    //   if (recipe.imageUrl) {
    //     const publicId = extractPublicId(recipe.imageUrl);
    //     if (publicId) {
    //       publicIds.add(publicId);
    //     }
    //   }
    // }

    return publicIds;
  }

  /**
   * Nettoie les images orphelines
   *
   * @param dryRun - Si true, liste les images à supprimer sans les supprimer
   * @param olderThanDays - Supprime uniquement les images plus anciennes que X jours
   * @returns Rapport de nettoyage
   */
  async cleanupOrphanImages(
    dryRun: boolean = true,
    olderThanDays: number = 7,
  ): Promise<{
    scanned: number;
    orphans: number;
    deleted: number;
    errors: number;
    orphanPublicIds: string[];
  }> {
    logInfo(`[ImageCleanup] Starting cleanup (dryRun: ${dryRun}, olderThanDays: ${olderThanDays})`);

    const report = {
      scanned: 0,
      orphans: 0,
      deleted: 0,
      errors: 0,
      orphanPublicIds: [] as string[],
    };

    try {
      // 1. Récupérer les public_ids référencés en BDD
      const referencedPublicIds = await this.getReferencedPublicIds();
      logInfo(`[ImageCleanup] Found ${referencedPublicIds.size} referenced images in database`);

      // 2. Lister toutes les images sur Cloudinary
      // Note: Cette fonctionnalité nécessite l'API Admin de Cloudinary
      // Pour l'instant, on va commenter cette partie et la laisser comme TODO
      // car elle nécessite la configuration de l'API Admin

      // TODO: Implémenter avec Cloudinary Admin API
      // const cloudinaryImages = await this.listCloudinaryImages('recette-ranger');

      logInfo('[ImageCleanup] Cloudinary Admin API not implemented yet');
      logInfo('[ImageCleanup] To implement: use cloudinary.api.resources() to list images');
      logInfo('[ImageCleanup] See: https://cloudinary.com/documentation/admin_api#get_resources');

      // Pour l'instant, retourner un rapport vide
      return report;

    } catch (error) {
      logError('[ImageCleanup] Error during cleanup', error);
      throw error;
    }
  }

  /**
   * Liste toutes les images dans un dossier Cloudinary
   *
   * @param folder - Dossier Cloudinary
   * @returns Liste des public_ids avec leurs métadonnées
   *
   * TODO: Implémenter cette méthode avec l'API Admin de Cloudinary
   * Note: Nécessite d'installer 'cloudinary' avec l'API Admin activée
   */
  // private async listCloudinaryImages(folder: string): Promise<Array<{
  //   publicId: string;
  //   createdAt: Date;
  // }>> {
  //   const v2 = cloudinary.v2;
  //   const resources = await v2.api.resources({
  //     type: 'upload',
  //     prefix: folder,
  //     max_results: 500, // Cloudinary limite à 500 par requête
  //   });
  //
  //   return resources.resources.map((resource: any) => ({
  //     publicId: resource.public_id,
  //     createdAt: new Date(resource.created_at),
  //   }));
  // }
}
