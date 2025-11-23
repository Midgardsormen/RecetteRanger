import { Controller, Get, UseGuards } from '@nestjs/common';
import { NavigationService } from './navigation.service';
import { NavigationItemDto } from './dto/navigation-item.dto';
import { JwtAuthGuard } from '../../api/auth/guards/jwt-auth.guard';

@Controller('api/navigation')
@UseGuards(JwtAuthGuard) // Mode privé : navigation nécessite authentification
export class NavigationController {
  constructor(private readonly navigationService: NavigationService) {}

  @Get()
  getNavigationItems(): NavigationItemDto[] {
    return this.navigationService.getNavigationItems();
  }

  @Get('reload')
  reloadConfig(): { message: string } {
    this.navigationService.reloadConfig();
    return { message: 'Navigation configuration reloaded' };
  }
}
