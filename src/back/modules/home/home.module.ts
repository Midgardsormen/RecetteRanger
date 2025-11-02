import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
import { PrismaModule } from '../../shared/prisma/prisma.module';
import { SvelteRenderService } from '../../services/svelte-render.service';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'votre-secret-jwt-tres-securise-changez-moi',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [HomeController],
  providers: [HomeService, SvelteRenderService],
})
export class HomeModule {}
