import { Injectable, CanActivate, ExecutionContext, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';

@Injectable()
export class OwnerOrAdminGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const resourceId = request.params.id;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Admin can access everything
    if (user.role === 'ADMIN') {
      return true;
    }

    // Determine resource type based on the controller
    const controllerClass = context.getClass().name;

    if (controllerClass === 'RecipeController') {
      const recipe = await this.prisma.recipe.findUnique({
        where: { id: resourceId },
        select: { ownerId: true },
      });

      if (!recipe) {
        throw new NotFoundException('Recipe not found');
      }

      if (recipe.ownerId !== user.id) {
        throw new ForbiddenException('You can only modify your own recipes');
      }

      return true;
    }

    if (controllerClass === 'IngredientController') {
      // Only admin can modify/delete ingredients
      throw new ForbiddenException('Only admins can modify ingredients');
    }

    return false;
  }
}
