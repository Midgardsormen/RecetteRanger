import { Module } from '@nestjs/common';
import { MenusController } from './menus.controller';
import { MenuModule } from '../../api/menu/menu.module';
import { SvelteRenderService } from '../../services/svelte-render.service';

@Module({
  imports: [MenuModule],
  controllers: [MenusController],
  providers: [SvelteRenderService],
})
export class MenusModule {}
