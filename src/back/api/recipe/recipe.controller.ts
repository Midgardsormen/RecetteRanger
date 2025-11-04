import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiCookieAuth } from '@nestjs/swagger';
import { RecipeService } from './recipe.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { RecipeDto } from './dto/recipe.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('recipes')
@ApiCookieAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/recipes')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle recette' })
  @ApiResponse({
    status: 201,
    description: 'Recette créée avec succès',
    type: RecipeDto
  })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  async create(@Request() req, @Body() createRecipeDto: CreateRecipeDto) {
    try {
      // Ajouter l'ID de l'utilisateur connecté
      const result = await this.recipeService.create({
        ...createRecipeDto,
        ownerId: req.user.id
      });
      return result;
    } catch (error) {
      console.error('Error creating recipe:', error);
      throw error;
    }
  }

  @Post('search')
  @ApiOperation({ summary: 'Rechercher des recettes' })
  @ApiResponse({
    status: 200,
    description: 'Résultats de recherche',
  })
  search(@Request() req, @Body() searchParams: any) {
    // Ajouter l'ID de l'utilisateur connecté aux paramètres de recherche
    return this.recipeService.search({
      ...searchParams,
      userId: req.user?.id
    });
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer toutes les recettes' })
  @ApiQuery({ name: 'ownerId', required: false, description: 'Filtrer par propriétaire' })
  @ApiResponse({
    status: 200,
    description: 'Liste des recettes',
    type: [RecipeDto]
  })
  findAll(@Query('ownerId') ownerId?: string) {
    return this.recipeService.findAll(ownerId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une recette par ID' })
  @ApiParam({ name: 'id', description: 'ID de la recette' })
  @ApiResponse({
    status: 200,
    description: 'Recette trouvée',
    type: RecipeDto
  })
  @ApiResponse({ status: 404, description: 'Recette non trouvée' })
  findOne(@Param('id') id: string) {
    return this.recipeService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour une recette' })
  @ApiParam({ name: 'id', description: 'ID de la recette' })
  @ApiResponse({
    status: 200,
    description: 'Recette mise à jour',
    type: RecipeDto
  })
  @ApiResponse({ status: 404, description: 'Recette non trouvée' })
  update(@Param('id') id: string, @Body() updateRecipeDto: UpdateRecipeDto) {
    return this.recipeService.update(id, updateRecipeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une recette' })
  @ApiParam({ name: 'id', description: 'ID de la recette' })
  @ApiResponse({ status: 200, description: 'Recette supprimée' })
  @ApiResponse({ status: 404, description: 'Recette non trouvée' })
  remove(@Param('id') id: string) {
    return this.recipeService.remove(id);
  }
}
