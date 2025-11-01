import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { IngredientService } from './ingredient.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { IngredientDto } from './dto/ingredient.dto';

@ApiTags('ingredients')
@Controller('ingredients')
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
  @ApiOperation({ summary: 'Mettre à jour un ingrédient' })
  @ApiParam({ name: 'id', description: 'ID de l\'ingrédient' })
  @ApiResponse({
    status: 200,
    description: 'Ingrédient mis à jour',
    type: IngredientDto
  })
  @ApiResponse({ status: 404, description: 'Ingrédient non trouvé' })
  @ApiResponse({ status: 409, description: 'Conflit avec un ingrédient existant' })
  update(@Param('id') id: string, @Body() updateIngredientDto: UpdateIngredientDto) {
    return this.ingredientService.update(id, updateIngredientDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un ingrédient' })
  @ApiParam({ name: 'id', description: 'ID de l\'ingrédient' })
  @ApiResponse({ status: 200, description: 'Ingrédient supprimé' })
  @ApiResponse({ status: 404, description: 'Ingrédient non trouvé' })
  remove(@Param('id') id: string) {
    return this.ingredientService.remove(id);
  }
}
