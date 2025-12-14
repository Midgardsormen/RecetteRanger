import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiCookieAuth } from '@nestjs/swagger';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { MenuDto } from './dto/menu.dto';
import { JwtAuthGuard, OwnerOrAdminGuard } from '../auth/guards';

@ApiTags('menus')
@ApiCookieAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/menus')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un nouveau menu/repas composé' })
  @ApiResponse({
    status: 201,
    description: 'Menu créé avec succès',
    type: MenuDto
  })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  async create(@Request() req, @Body() createMenuDto: CreateMenuDto) {
    return this.menuService.create({
      ...createMenuDto,
      userId: req.user.id
    });
  }

  @Post('search')
  @ApiOperation({ summary: 'Rechercher des menus' })
  @ApiResponse({
    status: 200,
    description: 'Résultats de recherche',
  })
  search(@Request() req, @Body() searchParams: any) {
    return this.menuService.search({
      ...searchParams,
      userId: req.user?.id
    });
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les menus' })
  @ApiQuery({ name: 'userId', required: false, description: 'Filtrer par utilisateur' })
  @ApiResponse({
    status: 200,
    description: 'Liste des menus',
    type: [MenuDto]
  })
  findAll(@Query('userId') userId?: string) {
    return this.menuService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un menu par ID' })
  @ApiParam({ name: 'id', description: 'ID du menu' })
  @ApiResponse({
    status: 200,
    description: 'Menu trouvé',
    type: MenuDto
  })
  @ApiResponse({ status: 404, description: 'Menu non trouvé' })
  findOne(@Param('id') id: string) {
    return this.menuService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(OwnerOrAdminGuard)
  @ApiOperation({ summary: 'Mettre à jour un menu' })
  @ApiParam({ name: 'id', description: 'ID du menu' })
  @ApiResponse({
    status: 200,
    description: 'Menu mis à jour',
    type: MenuDto
  })
  @ApiResponse({ status: 404, description: 'Menu non trouvé' })
  @ApiResponse({ status: 403, description: 'Accès interdit - vous ne pouvez modifier que vos propres menus' })
  update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.update(id, updateMenuDto);
  }

  @Delete(':id')
  @UseGuards(OwnerOrAdminGuard)
  @ApiOperation({ summary: 'Supprimer un menu' })
  @ApiParam({ name: 'id', description: 'ID du menu' })
  @ApiResponse({ status: 200, description: 'Menu supprimé' })
  @ApiResponse({ status: 404, description: 'Menu non trouvé' })
  @ApiResponse({ status: 403, description: 'Accès interdit - vous ne pouvez supprimer que vos propres menus' })
  remove(@Param('id') id: string) {
    return this.menuService.remove(id);
  }
}
