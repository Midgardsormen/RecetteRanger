import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // IMPORTANT: Trust proxy pour rate limiting correct sur Render/proxy
  // Sans ceci, tous les utilisateurs auront la même IP (celle du proxy)
  if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
  }

  // Configurer CORS pour accepter les cookies
  // Validation : ALLOWED_ORIGINS doit être défini en production
  if (process.env.NODE_ENV === 'production' && !process.env.ALLOWED_ORIGINS) {
    throw new Error('ALLOWED_ORIGINS must be set in production');
  }

  // IMPORTANT: Les origines doivent être exactes (sans slash final, sans chemin)
  // ✅ Correct: https://recetteranger.onrender.com
  // ❌ Incorrect: https://recetteranger.onrender.com/ ou https://recetteranger.onrender.com/login
  const allowedOrigins = process.env.NODE_ENV === 'production'
    ? process.env.ALLOWED_ORIGINS?.split(',')
        .map(s => s.trim())
        .filter(Boolean) || []
    : ['http://localhost:5173'];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true, // Permet l'envoi de cookies
  });

  // Activer le parser de cookies
  app.use(cookieParser());

  // Configurer les headers de sécurité avec Helmet
  // Construction des directives CSP selon l'environnement
  // NOTE: Si en dev vous voyez des erreurs CSP liées à Vite/Svelte HMR ou source maps,
  // vous pouvez temporairement ajouter 'unsafe-eval' à scriptSrc en dev uniquement.
  // NE JAMAIS ajouter 'unsafe-eval' en production.
  const cspDirectives: Record<string, string[]> = {
    defaultSrc: ["'self'"],
    styleSrc: [
      "'self'",
      "'unsafe-inline'", // Nécessaire pour les styles inline de Svelte
      "https://fonts.googleapis.com",
      "https://cdnjs.cloudflare.com",
      ...(process.env.NODE_ENV === 'development' ? ["http://localhost:5173"] : [])
    ],
    fontSrc: [
      "'self'",
      "https://fonts.gstatic.com"
    ],
    imgSrc: [
      "'self'",
      "data:", // Pour les SVG inline (ex: Select.svelte)
      "https://res.cloudinary.com", // Images Cloudinary
      "blob:", // Pour les previews d'upload
      ...(process.env.NODE_ENV === 'development' ? ["https://*"] : []) // Logos magasins en dev
    ],
    scriptSrc: [
      "'self'",
      "https://cdnjs.cloudflare.com", // CropperJS
      ...(process.env.NODE_ENV === 'development' ? ["http://localhost:5173", "'unsafe-inline'"] : [])
    ],
    connectSrc: [
      "'self'",
      ...(process.env.NODE_ENV === 'development' ? ["http://localhost:3000", "http://localhost:5173", "ws://localhost:5173"] : [])
    ],
    objectSrc: ["'none'"],
    baseUri: ["'self'"], // Limite les URLs de base
    frameAncestors: ["'none'"] // Équivalent moderne de X-Frame-Options: DENY
  };

  // IMPORTANT: Ajouter upgradeInsecureRequests UNIQUEMENT en production
  // En dev, la directive ne doit pas exister (pas même avec null) pour éviter
  // qu'elle soit envoyée accidentellement selon les versions de Helmet
  if (process.env.NODE_ENV === 'production') {
    cspDirectives.upgradeInsecureRequests = [];
  }

  app.use(helmet({
    contentSecurityPolicy: {
      directives: cspDirectives
    },
    // IMPORTANT: crossOriginEmbedderPolicy est désactivé par défaut dans Helmet
    // mais on le force explicitement à false pour être certain qu'il ne soit pas activé,
    // car il bloquerait le chargement des images Cloudinary
    crossOriginEmbedderPolicy: false,
  }));

  // Activer la validation globale
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Supprime les propriétés non définies dans le DTO
    forbidNonWhitelisted: true, // Renvoie une erreur si des propriétés non définies sont envoyées
    transform: true, // Transforme automatiquement les types
  }));

  // Configuration Swagger - UNIQUEMENT en développement
  if (process.env.NODE_ENV !== 'production') {
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
    console.log(`📚 Swagger documentation available at: http://localhost:${port}/api`);
  }

  // Servir les fichiers statiques du client
  app.useStaticAssets(join(__dirname, '../client'), {
    prefix: '/assets/',
  });

  // Servir les fichiers uploadés (depuis dist/ vers public/)
  app.useStaticAssets(join(__dirname, '../public'), {
    prefix: '/',
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap();
