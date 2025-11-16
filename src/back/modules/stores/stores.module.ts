import { Module } from '@nestjs/common';
import { StoresController } from './stores.controller';
import { StoreModule } from '../../api/store/store.module';
import { SvelteRenderService } from '../../services/svelte-render.service';

@Module({
  imports: [StoreModule],
  controllers: [StoresController],
  providers: [SvelteRenderService],
})
export class StoresModule {}
