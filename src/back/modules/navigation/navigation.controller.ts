import { Controller, Get } from '@nestjs/common';
import { NavigationService } from './navigation.service';
import { NavigationItemDto } from './dto/navigation-item.dto';

@Controller('api/navigation')
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
