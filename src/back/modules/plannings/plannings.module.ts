import { Module } from '@nestjs/common';
import { PlanningsController } from './plannings.controller';
import { SvelteRenderService } from '../../services/svelte-render.service';

@Module({
  controllers: [PlanningsController],
  providers: [SvelteRenderService],
})
export class PlanningsModule {}
