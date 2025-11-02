import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Configurer CORS pour accepter les cookies
  app.enableCors({
    origin: 'http://localhost:5173', // URL du client Vite
    credentials: true, // Permet l'envoi de cookies
  });

  // Activer le parser de cookies
  app.use(cookieParser());

  // Activer la validation globale
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Supprime les propriétés non définies dans le DTO
    forbidNonWhitelisted: true, // Renvoie une erreur si des propriétés non définies sont envoyées
    transform: true, // Transforme automatiquement les types
  }));

  // Configuration Swagger
  const config = new DocumentBuilder()
    .setTitle('RecetteRanger API')
    .setDescription('API de gestion de recettes, planification de repas et listes de courses. L\'authentification se fait via des cookies HTTP-only.')
    .setVersion('1.0')
    .addTag('auth', 'Authentification')
    .addTag('users', 'Gestion des utilisateurs')
    .addTag('recipes', 'Gestion des recettes')
    .addTag('ingredients', 'Gestion des ingrédients')
    .addTag('meal-plans', 'Planification des repas')
    .addTag('shopping-lists', 'Listes de courses')
    .addCookieAuth('access_token', {
      type: 'http',
      in: 'cookie',
      scheme: 'bearer',
      description: 'Cookie HTTP-only contenant le JWT'
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Servir les fichiers statiques du client
  app.useStaticAssets(join(__dirname, '../client'), {
    prefix: '/assets/',
  });

  // Servir les fichiers uploadés (depuis dist/ vers public/)
  app.useStaticAssets(join(__dirname, '../public'), {
    prefix: '/',
  });

  await app.listen(3000);
  console.log('🚀 Application is running on: http://localhost:3000');
  console.log('📚 Swagger documentation available at: http://localhost:3000/api');
}

bootstrap();
