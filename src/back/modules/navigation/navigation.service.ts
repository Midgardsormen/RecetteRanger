import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import { NavigationItemDto } from './dto/navigation-item.dto';
import { logError } from '../../shared/utils/logger.util';

@Injectable()
export class NavigationService {
  private navigationItems: NavigationItemDto[];

  constructor() {
    this.loadNavigationConfig();
  }

  private loadNavigationConfig(): void {
    try {
      const configPath = join(__dirname, '../../../config/navigation.json');
      const configData = readFileSync(configPath, 'utf-8');
      const config = JSON.parse(configData);
      this.navigationItems = config.items;
    } catch (error) {
      logError('Failed to load navigation config', error);
      // Fallback to default navigation
      this.navigationItems = [
        { href: '/', label: 'Home', icon: '🏠', order: 1, visible: true },
        { href: '/recettes', label: 'Recipes', icon: '📖', order: 2, visible: true },
        { href: '/plannings', label: 'Meal Plans', icon: '📅', order: 3, visible: true },
        { href: '/shopping-lists', label: 'Shopping Lists', icon: '🛒', order: 4, visible: true }
      ];
    }
  }

  getNavigationItems(): NavigationItemDto[] {
    return this.navigationItems
      .filter(item => item.visible)
      .sort((a, b) => a.order - b.order);
  }

  reloadConfig(): void {
    this.loadNavigationConfig();
  }
}
