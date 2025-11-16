import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { SvelteRenderService } from '../../services/svelte-render.service';
import { PrismaModule } from '../../shared/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AdminController],
  providers: [SvelteRenderService],
})
export class AdminModule {}
