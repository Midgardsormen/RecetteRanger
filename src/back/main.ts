import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Configuration Swagger
  const config = new DocumentBuilder()
    .setTitle('RecetteRanger API')
    .setDescription('API de gestion de recettes, planification de repas et listes de courses')
    .setVersion('1.0')
    .addTag('users', 'Gestion des utilisateurs')
    .addTag('recipes', 'Gestion des recettes')
    .addTag('ingredients', 'Gestion des ingrédients')
    .addTag('meal-plans', 'Planification des repas')
    .addTag('shopping-lists', 'Listes de courses')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Servir les fichiers statiques du client
  app.useStaticAssets(join(__dirname, '../client'), {
    prefix: '/assets/',
  });

  await app.listen(3000);
  console.log('🚀 Application is running on: http://localhost:3000');
  console.log('📚 Swagger documentation available at: http://localhost:3000/api');
}

bootstrap();
