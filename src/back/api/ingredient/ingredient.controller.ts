import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiCookieAuth } from '@nestjs/swagger';
import { IngredientService } from './ingredient.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { IngredientDto } from './dto/ingredient.dto';
import { SearchIngredientsDto } from './dto/search-ingredients.dto';
import { CheckDuplicatesDto, CheckDuplicatesResponseDto } from './dto/check-duplicates.dto';
import { JwtAuthGuard, AdminGuard } from '../auth/guards';

@ApiTags('ingredients')
@ApiCookieAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/ingredients')
export class IngredientController {
  constructor(private readonly ingredientService: IngredientService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un nouvel ingrédient' })
  @ApiResponse({
    status: 201,
    description: 'Ingrédient créé avec succès',
    type: IngredientDto
  })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 409, description: 'Ingrédient déjà existant dans ce rayon' })
  create(@Body() createIngredientDto: CreateIngredientDto) {
    return this.ingredientService.create(createIngredientDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les ingrédients' })
  @ApiQuery({ name: 'aisle', required: false, description: 'Filtrer par rayon' })
  @ApiResponse({
    status: 200,
    description: 'Liste des ingrédients',
    type: [IngredientDto]
  })
  findAll(@Query('aisle') aisle?: string) {
    return this.ingredientService.findAll(aisle);
  }

  @Post('search')
  @ApiOperation({ summary: 'Recherche avancée d\'ingrédients avec filtres et pagination' })
  @ApiResponse({
    status: 200,
    description: 'Résultats de recherche avec pagination',
  })
  search(@Body() searchDto: SearchIngredientsDto) {
    return this.ingredientService.search(searchDto);
  }

  @Post('check-duplicates')
  @ApiOperation({ summary: 'Vérifier si un ingrédient existe déjà ou est similaire' })
  @ApiResponse({
    status: 200,
    description: 'Liste des ingrédients similaires',
    type: CheckDuplicatesResponseDto,
  })
  checkDuplicates(@Body() checkDto: CheckDuplicatesDto) {
    return this.ingredientService.checkDuplicates(checkDto);
  }

  @Get('incomplete/count')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Compter les ingrédients incomplets (admin uniquement)' })
  @ApiResponse({
    status: 200,
    description: 'Nombre d\'ingrédients incomplets',
    schema: {
      type: 'object',
      properties: {
        count: { type: 'number' }
      }
    }
  })
  @ApiResponse({ status: 403, description: 'Accès interdit - droits admin requis' })
  getIncompleteCount() {
    return this.ingredientService.getIncompleteCount();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un ingrédient par ID' })
  @ApiParam({ name: 'id', description: 'ID de l\'ingrédient' })
  @ApiResponse({
    status: 200,
    description: 'Ingrédient trouvé',
    type: IngredientDto
  })
  @ApiResponse({ status: 404, description: 'Ingrédient non trouvé' })
  findOne(@Param('id') id: string) {
    return this.ingredientService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Mettre à jour un ingrédient (admin uniquement)' })
  @ApiParam({ name: 'id', description: 'ID de l\'ingrédient' })
  @ApiResponse({
    status: 200,
    description: 'Ingrédient mis à jour',
    type: IngredientDto
  })
  @ApiResponse({ status: 404, description: 'Ingrédient non trouvé' })
  @ApiResponse({ status: 403, description: 'Accès interdit - droits admin requis' })
  @ApiResponse({ status: 409, description: 'Conflit avec un ingrédient existant' })
  update(@Param('id') id: string, @Body() updateIngredientDto: UpdateIngredientDto) {
    return this.ingredientService.update(id, updateIngredientDto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Supprimer un ingrédient (admin uniquement)' })
  @ApiParam({ name: 'id', description: 'ID de l\'ingrédient' })
  @ApiResponse({ status: 200, description: 'Ingrédient supprimé' })
  @ApiResponse({ status: 404, description: 'Ingrédient non trouvé' })
  @ApiResponse({ status: 403, description: 'Accès interdit - droits admin requis' })
  remove(@Param('id') id: string) {
    return this.ingredientService.remove(id);
  }
}
