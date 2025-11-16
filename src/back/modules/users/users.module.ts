import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UserService } from '../../api/user/user.service';
import { SvelteRenderService } from '../../services/svelte-render.service';
import { PrismaModule } from '../../shared/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UserService, SvelteRenderService],
})
export class UsersModule {}
