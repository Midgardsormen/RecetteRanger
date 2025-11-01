import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { SvelteRenderService } from './services/svelte-render.service';
import { NavigationModule } from './modules/navigation/navigation.module';

@Module({
  imports: [NavigationModule],
  controllers: [AppController],
  providers: [SvelteRenderService],
})
export class AppModule {}
