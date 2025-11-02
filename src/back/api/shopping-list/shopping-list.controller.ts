import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiCookieAuth } from '@nestjs/swagger';
import { ShoppingListService } from './shopping-list.service';
import { CreateShoppingListDto, CreateShoppingListItemDto } from './dto/create-shopping-list.dto';
import { UpdateShoppingListDto, UpdateShoppingListItemDto } from './dto/update-shopping-list.dto';
import { ShoppingListDto, ShoppingListItemDto } from './dto/shopping-list.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('shopping-lists')
@ApiCookieAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/shopping-lists')
export class ShoppingListController {
  constructor(private readonly shoppingListService: ShoppingListService) {}

  // ShoppingList endpoints
  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle liste de courses' })
  @ApiResponse({
    status: 201,
    description: 'Liste de courses créée avec succès',
    type: ShoppingListDto
  })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  create(@Body() createShoppingListDto: CreateShoppingListDto) {
    return this.shoppingListService.create(createShoppingListDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer les listes de courses' })
  @ApiQuery({ name: 'userId', required: false, description: 'Filtrer par utilisateur' })
  @ApiQuery({ name: 'status', required: false, description: 'Filtrer par statut (OPEN, LOCKED, ARCHIVED)' })
  @ApiResponse({
    status: 200,
    description: 'Liste des listes de courses',
    type: [ShoppingListDto]
  })
  findAll(@Query('userId') userId?: string, @Query('status') status?: string) {
    return this.shoppingListService.findAll(userId, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une liste de courses par ID' })
  @ApiParam({ name: 'id', description: 'ID de la liste de courses' })
  @ApiResponse({
    status: 200,
    description: 'Liste de courses trouvée',
    type: ShoppingListDto
  })
  @ApiResponse({ status: 404, description: 'Liste de courses non trouvée' })
  findOne(@Param('id') id: string) {
    return this.shoppingListService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour une liste de courses' })
  @ApiParam({ name: 'id', description: 'ID de la liste de courses' })
  @ApiResponse({
    status: 200,
    description: 'Liste de courses mise à jour',
    type: ShoppingListDto
  })
  @ApiResponse({ status: 404, description: 'Liste de courses non trouvée' })
  update(@Param('id') id: string, @Body() updateShoppingListDto: UpdateShoppingListDto) {
    return this.shoppingListService.update(id, updateShoppingListDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une liste de courses' })
  @ApiParam({ name: 'id', description: 'ID de la liste de courses' })
  @ApiResponse({ status: 200, description: 'Liste de courses supprimée' })
  @ApiResponse({ status: 404, description: 'Liste de courses non trouvée' })
  remove(@Param('id') id: string) {
    return this.shoppingListService.remove(id);
  }

  // ShoppingListItem endpoints
  @Post(':listId/items')
  @ApiOperation({ summary: 'Ajouter un item à une liste de courses' })
  @ApiParam({ name: 'listId', description: 'ID de la liste de courses' })
  @ApiResponse({
    status: 201,
    description: 'Item créé avec succès',
    type: ShoppingListItemDto
  })
  @ApiResponse({ status: 404, description: 'Liste de courses non trouvée' })
  createItem(@Param('listId') listId: string, @Body() createShoppingListItemDto: CreateShoppingListItemDto) {
    return this.shoppingListService.createItem(listId, createShoppingListItemDto);
  }

  @Patch('items/:id')
  @ApiOperation({ summary: 'Mettre à jour un item de liste de courses' })
  @ApiParam({ name: 'id', description: 'ID de l\'item' })
  @ApiResponse({
    status: 200,
    description: 'Item mis à jour',
    type: ShoppingListItemDto
  })
  @ApiResponse({ status: 404, description: 'Item non trouvé' })
  updateItem(@Param('id') id: string, @Body() updateShoppingListItemDto: UpdateShoppingListItemDto) {
    return this.shoppingListService.updateItem(id, updateShoppingListItemDto);
  }

  @Delete('items/:id')
  @ApiOperation({ summary: 'Supprimer un item de liste de courses' })
  @ApiParam({ name: 'id', description: 'ID de l\'item' })
  @ApiResponse({ status: 200, description: 'Item supprimé' })
  @ApiResponse({ status: 404, description: 'Item non trouvé' })
  removeItem(@Param('id') id: string) {
    return this.shoppingListService.removeItem(id);
  }
}
