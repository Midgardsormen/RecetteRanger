import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiCookieAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('users')
@ApiCookieAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un nouvel utilisateur' })
  @ApiResponse({
    status: 201,
    description: 'Utilisateur créé avec succès',
    type: UserDto
  })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les utilisateurs' })
  @ApiResponse({
    status: 200,
    description: 'Liste des utilisateurs',
    type: [UserDto]
  })
  findAll() {
    return this.userService.findAll();
  }

  @Get('pending/count')
  @ApiOperation({ summary: 'Compter les utilisateurs en attente de validation' })
  @ApiResponse({
    status: 200,
    description: 'Nombre d\'utilisateurs en attente',
    schema: {
      type: 'object',
      properties: {
        count: { type: 'number' }
      }
    }
  })
  getPendingCount() {
    return this.userService.getPendingCount();
  }

  @Get(':id/public')
  @ApiOperation({ summary: 'Récupérer le profil public d\'un utilisateur' })
  @ApiParam({ name: 'id', description: 'ID de l\'utilisateur' })
  @ApiResponse({
    status: 200,
    description: 'Profil public trouvé'
  })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  async getPublicProfile(@Param('id') id: string) {
    return this.userService.findPublicProfile(id);
  }

  @Get(':id/recipes')
  @ApiOperation({ summary: 'Récupérer les recettes récentes d\'un utilisateur' })
  @ApiParam({ name: 'id', description: 'ID de l\'utilisateur' })
  @ApiResponse({
    status: 200,
    description: 'Recettes récentes trouvées'
  })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  async getUserRecipes(@Param('id') id: string) {
    return this.userService.findUserRecentRecipes(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un utilisateur par ID' })
  @ApiParam({ name: 'id', description: 'ID de l\'utilisateur' })
  @ApiResponse({
    status: 200,
    description: 'Utilisateur trouvé',
    type: UserDto
  })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour un utilisateur' })
  @ApiParam({ name: 'id', description: 'ID de l\'utilisateur' })
  @ApiResponse({
    status: 200,
    description: 'Utilisateur mis à jour',
    type: UserDto
  })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Patch(':id/approve')
  @ApiOperation({ summary: 'Approuver un compte utilisateur' })
  @ApiParam({ name: 'id', description: 'ID de l\'utilisateur' })
  @ApiResponse({ status: 200, description: 'Compte approuvé' })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  approve(@Param('id') id: string) {
    return this.userService.approveUser(id);
  }

  @Patch(':id/reject')
  @ApiOperation({ summary: 'Rejeter un compte utilisateur' })
  @ApiParam({ name: 'id', description: 'ID de l\'utilisateur' })
  @ApiResponse({ status: 200, description: 'Compte rejeté' })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  reject(@Param('id') id: string) {
    return this.userService.rejectUser(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un utilisateur' })
  @ApiParam({ name: 'id', description: 'ID de l\'utilisateur' })
  @ApiResponse({ status: 200, description: 'Utilisateur supprimé' })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
