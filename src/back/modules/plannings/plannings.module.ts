import { Module } from '@nestjs/common';
import { PlanningsController } from './plannings.controller';
import { PlanningsService } from './plannings.service';
import { PrismaModule } from '../../shared/prisma/prisma.module';
import { SvelteRenderService } from '../../services/svelte-render.service';

@Module({
  imports: [PrismaModule],
  controllers: [PlanningsController],
  providers: [PlanningsService, SvelteRenderService],
})
export class PlanningsModule {}
