import { Module } from '@nestjs/common';
import { DemoController } from './demo.controller';
import { SvelteRenderService } from '../../services/svelte-render.service';

@Module({
  controllers: [DemoController],
  providers: [SvelteRenderService],
})
export class DemoModule {}
