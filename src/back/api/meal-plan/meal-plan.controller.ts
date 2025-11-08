import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiCookieAuth } from '@nestjs/swagger';
import { MealPlanService } from './meal-plan.service';
import { CreateMealPlanDayDto, CreateMealPlanItemDto } from './dto/create-meal-plan.dto';
import { UpdateMealPlanDayDto, UpdateMealPlanItemDto } from './dto/update-meal-plan.dto';
import { MealPlanDayDto, MealPlanItemDto } from './dto/meal-plan.dto';
import { CreateMealSlotConfigDto, UpdateMealSlotConfigDto, MealSlotConfigDto } from './dto/meal-slot-config.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('meal-plans')
@ApiCookieAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/meal-plans')
export class MealPlanController {
  constructor(private readonly mealPlanService: MealPlanService) {}

  // MealPlanDay endpoints
  @Post('days')
  @ApiOperation({ summary: 'Créer un jour de planification' })
  @ApiResponse({
    status: 201,
    description: 'Jour de planification créé avec succès',
    type: MealPlanDayDto
  })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 409, description: 'Jour déjà existant pour cet utilisateur et cette date' })
  createDay(@Body() createMealPlanDayDto: CreateMealPlanDayDto) {
    return this.mealPlanService.createDay(createMealPlanDayDto);
  }

  @Get('days')
  @ApiOperation({ summary: 'Récupérer les jours de planification' })
  @ApiQuery({ name: 'userId', required: false, description: 'Filtrer par utilisateur' })
  @ApiQuery({ name: 'fromDate', required: false, description: 'Date de début (ISO 8601)' })
  @ApiQuery({ name: 'toDate', required: false, description: 'Date de fin (ISO 8601)' })
  @ApiResponse({
    status: 200,
    description: 'Liste des jours de planification',
    type: [MealPlanDayDto]
  })
  findAllDays(
    @Query('userId') userId?: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
  ) {
    return this.mealPlanService.findAllDays(
      userId,
      fromDate ? new Date(fromDate) : undefined,
      toDate ? new Date(toDate) : undefined,
    );
  }

  @Get('days/:id')
  @ApiOperation({ summary: 'Récupérer un jour de planification par ID' })
  @ApiParam({ name: 'id', description: 'ID du jour de planification' })
  @ApiResponse({
    status: 200,
    description: 'Jour de planification trouvé',
    type: MealPlanDayDto
  })
  @ApiResponse({ status: 404, description: 'Jour de planification non trouvé' })
  findOneDay(@Param('id') id: string) {
    return this.mealPlanService.findOneDay(id);
  }

  @Patch('days/:id')
  @ApiOperation({ summary: 'Mettre à jour un jour de planification' })
  @ApiParam({ name: 'id', description: 'ID du jour de planification' })
  @ApiResponse({
    status: 200,
    description: 'Jour de planification mis à jour',
    type: MealPlanDayDto
  })
  @ApiResponse({ status: 404, description: 'Jour de planification non trouvé' })
  updateDay(@Param('id') id: string, @Body() updateMealPlanDayDto: UpdateMealPlanDayDto) {
    return this.mealPlanService.updateDay(id, updateMealPlanDayDto);
  }

  @Delete('days/:id')
  @ApiOperation({ summary: 'Supprimer un jour de planification' })
  @ApiParam({ name: 'id', description: 'ID du jour de planification' })
  @ApiResponse({ status: 200, description: 'Jour de planification supprimé' })
  @ApiResponse({ status: 404, description: 'Jour de planification non trouvé' })
  removeDay(@Param('id') id: string) {
    return this.mealPlanService.removeDay(id);
  }

  // MealPlanItem endpoints
  @Post('days/:dayId/items')
  @ApiOperation({ summary: 'Ajouter un item à un jour de planification' })
  @ApiParam({ name: 'dayId', description: 'ID du jour de planification' })
  @ApiResponse({
    status: 201,
    description: 'Item créé avec succès',
    type: MealPlanItemDto
  })
  @ApiResponse({ status: 404, description: 'Jour de planification non trouvé' })
  @ApiResponse({ status: 409, description: 'Item déjà existant pour ce créneau' })
  createItem(@Param('dayId') dayId: string, @Body() createMealPlanItemDto: CreateMealPlanItemDto) {
    return this.mealPlanService.createItem(dayId, createMealPlanItemDto);
  }

  @Patch('items/:id')
  @ApiOperation({ summary: 'Mettre à jour un item de planification' })
  @ApiParam({ name: 'id', description: 'ID de l\'item' })
  @ApiResponse({
    status: 200,
    description: 'Item mis à jour',
    type: MealPlanItemDto
  })
  @ApiResponse({ status: 404, description: 'Item non trouvé' })
  updateItem(@Param('id') id: string, @Body() updateMealPlanItemDto: UpdateMealPlanItemDto) {
    return this.mealPlanService.updateItem(id, updateMealPlanItemDto);
  }

  @Delete('items/:id')
  @ApiOperation({ summary: 'Supprimer un item de planification' })
  @ApiParam({ name: 'id', description: 'ID de l\'item' })
  @ApiResponse({ status: 200, description: 'Item supprimé' })
  @ApiResponse({ status: 404, description: 'Item non trouvé' })
  removeItem(@Param('id') id: string) {
    return this.mealPlanService.removeItem(id);
  }

  // MealSlotConfig endpoints
  @Post('slot-configs')
  @ApiOperation({ summary: 'Créer une configuration de créneau' })
  @ApiQuery({ name: 'userId', description: 'ID de l\'utilisateur' })
  @ApiResponse({
    status: 201,
    description: 'Configuration créée avec succès',
    type: MealSlotConfigDto
  })
  @ApiResponse({ status: 409, description: 'Configuration déjà existante pour ce créneau' })
  createSlotConfig(@Query('userId') userId: string, @Body() createMealSlotConfigDto: CreateMealSlotConfigDto) {
    return this.mealPlanService.createSlotConfig(userId, createMealSlotConfigDto);
  }

  @Get('slot-configs')
  @ApiOperation({ summary: 'Récupérer les configurations de créneaux d\'un utilisateur' })
  @ApiQuery({ name: 'userId', description: 'ID de l\'utilisateur' })
  @ApiResponse({
    status: 200,
    description: 'Liste des configurations',
    type: [MealSlotConfigDto]
  })
  findAllSlotConfigs(@Query('userId') userId: string) {
    return this.mealPlanService.findAllSlotConfigs(userId);
  }

  @Get('slot-configs/:id')
  @ApiOperation({ summary: 'Récupérer une configuration par ID' })
  @ApiParam({ name: 'id', description: 'ID de la configuration' })
  @ApiResponse({
    status: 200,
    description: 'Configuration trouvée',
    type: MealSlotConfigDto
  })
  @ApiResponse({ status: 404, description: 'Configuration non trouvée' })
  findOneSlotConfig(@Param('id') id: string) {
    return this.mealPlanService.findOneSlotConfig(id);
  }

  @Patch('slot-configs/:id')
  @ApiOperation({ summary: 'Mettre à jour une configuration' })
  @ApiParam({ name: 'id', description: 'ID de la configuration' })
  @ApiResponse({
    status: 200,
    description: 'Configuration mise à jour',
    type: MealSlotConfigDto
  })
  @ApiResponse({ status: 404, description: 'Configuration non trouvée' })
  updateSlotConfig(@Param('id') id: string, @Body() updateMealSlotConfigDto: UpdateMealSlotConfigDto) {
    return this.mealPlanService.updateSlotConfig(id, updateMealSlotConfigDto);
  }

  @Delete('slot-configs/:id')
  @ApiOperation({ summary: 'Supprimer une configuration' })
  @ApiParam({ name: 'id', description: 'ID de la configuration' })
  @ApiResponse({ status: 200, description: 'Configuration supprimée' })
  @ApiResponse({ status: 404, description: 'Configuration non trouvée' })
  removeSlotConfig(@Param('id') id: string) {
    return this.mealPlanService.removeSlotConfig(id);
  }

  @Post('slot-configs/initialize')
  @ApiOperation({ summary: 'Initialiser les configurations par défaut pour un utilisateur' })
  @ApiQuery({ name: 'userId', description: 'ID de l\'utilisateur' })
  @ApiResponse({ status: 201, description: 'Configurations initialisées' })
  initializeDefaultSlotConfigs(@Query('userId') userId: string) {
    return this.mealPlanService.initializeDefaultSlotConfigs(userId);
  }
}
