import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { StoreService } from './store.service';
import { CreateStoreDto, UpdateStoreDto, SearchStoresDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('stores')
@Controller('api/stores')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle enseigne (accessible à tous)' })
  create(@Body() createStoreDto: CreateStoreDto) {
    return this.storeService.create(createStoreDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer toutes les enseignes avec pagination' })
  findAll(@Query() searchDto: SearchStoresDto) {
    return this.storeService.findAll(searchDto);
  }

  @Get('check-duplicates')
  @ApiOperation({ summary: 'Vérifier les enseignes similaires' })
  checkDuplicates(@Query('name') name: string) {
    return this.storeService.checkDuplicates(name);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une enseigne par son ID' })
  findOne(@Param('id') id: string) {
    return this.storeService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour une enseigne' })
  update(@Param('id') id: string, @Body() updateStoreDto: UpdateStoreDto) {
    return this.storeService.update(id, updateStoreDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une enseigne' })
  remove(@Param('id') id: string) {
    return this.storeService.remove(id);
  }
}
