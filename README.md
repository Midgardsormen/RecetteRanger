# RecetteRanger

Application de gestion de recettes construite avec **NestJS** (backend) et **Svelte** (frontend) avec **Server-Side Rendering (SSR)** et **hydration** - sans utiliser SvelteKit.

## Architecture

- **Backend**: NestJS (Node.js framework)
- **Frontend**: Svelte avec SSR custom
- **Build Tool**: Vite
- **TypeScript**: Configuration complète

## Structure du projet

```
RecetteRanger/
├── src/
│   ├── server/              # Code NestJS
│   │   ├── main.ts          # Point d'entrée du serveur
│   │   ├── app.module.ts    # Module principal
│   │   ├── app.controller.ts # Contrôleur principal
│   │   └── services/
│   │       └── svelte-render.service.ts # Service de rendu SSR
│   └── client/              # Code Svelte
│       ├── components/
│       │   └── App.svelte   # Composant principal
│       ├── entry-client.ts  # Point d'entrée client (hydration)
│       ├── entry-server.ts  # Point d'entrée serveur (SSR)
│       └── index.html       # Template HTML
├── vite.config.ts           # Configuration Vite
├── tsconfig.json            # Configuration TypeScript
├── nest-cli.json            # Configuration NestJS
└── package.json
```

## Installation

```bash
npm install
```

## Développement

En mode développement, lancez les deux serveurs en parallèle:

```bash
npm run dev
```

Cela lance:
- Le serveur NestJS sur `http://localhost:3000`
- Le serveur Vite sur `http://localhost:5173` (pour le HMR)

Accédez à l'application sur: **http://localhost:3000**

## Build Production

```bash
npm run build
```

Cela génère:
1. Le code serveur NestJS compilé dans `dist/`
2. Le code client Svelte optimisé dans `dist/client/`

## Démarrage Production

```bash
npm run start:prod
```

## Fonctionnalités

✅ **Server-Side Rendering (SSR)** - Le HTML est généré côté serveur
✅ **Hydration** - Les composants Svelte s'hydratent côté client
✅ **Hot Module Replacement** - Rechargement à chaud en développement
✅ **TypeScript** - Support complet
✅ **API REST** - Endpoints NestJS prêts à l'emploi

## Routes disponibles

- `/` - Page d'accueil
- `/recettes` - Liste des recettes

## Comment ça marche

1. **SSR**: Quand vous visitez une page, NestJS rend le composant Svelte en HTML côté serveur
2. **Hydration**: Le navigateur reçoit le HTML et charge le JavaScript Svelte pour rendre l'application interactive
3. **Réactivité**: Une fois hydraté, Svelte gère toutes les interactions côté client

## Développement futur

- Ajouter une base de données (PostgreSQL, MongoDB, etc.)
- Implémenter l'authentification
- Créer des composants pour la gestion des recettes
- Ajouter un système de recherche et de filtrage
- Upload d'images de recettes