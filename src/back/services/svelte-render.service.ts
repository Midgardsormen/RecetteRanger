import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import { logError } from '../shared/utils/logger.util';

@Injectable()
export class SvelteRenderService {
  private template: string;
  private isDev = process.env.NODE_ENV !== 'production';
  private manifest: any = null;

  constructor() {
    // Charger le template HTML
    const templatePath = join(__dirname, '../../client/index.html');
    try {
      this.template = readFileSync(templatePath, 'utf-8');
    } catch (error) {
      // Template par défaut si le fichier n'existe pas encore
      this.template = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex, nofollow">
  <title>RecetteRanger</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.2/cropper.min.css" />
  <!--head-->
</head>
<body>
  <div id="app"><!--app--></div>
  <!--scripts-->
</body>
</html>`;
    }

    // Charger le manifest Vite en production
    if (!this.isDev) {
      // __dirname est dans dist/services, le manifest est dans dist/client
      const manifestPath = join(__dirname, '../client/manifest.json');
      try {
        console.log('Attempting to load manifest from:', manifestPath);
        console.log('__dirname is:', __dirname);
        this.manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
        console.log('Manifest loaded successfully, keys:', Object.keys(this.manifest).length);
      } catch (error) {
        console.error('Failed to load Vite manifest from:', manifestPath);
        logError('Failed to load Vite manifest', error);
      }
    }
  }

  async render(componentName: string, props: any = {}): Promise<string> {
    try {
      // En développement, on utilise un système simplifié
      if (this.isDev) {
        return this.renderDev(componentName, props);
      }

      // En production, on utilise uniquement le client-side rendering
      // car Vite génère les composants avec des noms hashés
      return this.renderProd(componentName, props);
    } catch (error) {
      logError('SSR rendering error', error);
      return this.renderDev(componentName, props);
    }
  }

  private async renderProd(componentName: string, props: any): Promise<string> {
    const initialData = {
      pageName: componentName,
      props: props
    };

    // Si le manifest n'est pas chargé, essayer de le charger maintenant
    if (!this.manifest) {
      // __dirname est dans dist/services, le manifest est dans dist/client
      const manifestPath = join(__dirname, '../client/manifest.json');
      console.log('[MANIFEST DEBUG] Attempting to load manifest from:', manifestPath);
      console.log('[MANIFEST DEBUG] __dirname is:', __dirname);
      try {
        const fs = require('fs');
        if (fs.existsSync(manifestPath)) {
          this.manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
          console.log('[MANIFEST DEBUG] Manifest loaded successfully, keys:', Object.keys(this.manifest).length);
        } else {
          console.error('[MANIFEST DEBUG] Manifest file does not exist at:', manifestPath);
          // Lister le contenu du répertoire
          const clientDir = join(__dirname, '../client');
          if (fs.existsSync(clientDir)) {
            console.log('[MANIFEST DEBUG] Contents of client dir:', fs.readdirSync(clientDir));
          } else {
            console.error('[MANIFEST DEBUG] Client directory does not exist:', clientDir);
          }
        }
      } catch (error) {
        console.error('[MANIFEST DEBUG] Failed to load manifest:', error);
      }
    }

    // Trouver l'entrée principale dans le manifest
    let entryScript = '/assets/main.js'; // Fallback
    let cssLinks = '';

    if (this.manifest) {
      // Le manifest Vite a cette structure: { "src/view/entry-client.ts": { "file": "assets/main-ABC123.js", "css": [...], ... } }
      const mainEntry = this.manifest['src/view/entry-client.ts'];
      if (mainEntry && mainEntry.file) {
        entryScript = '/' + mainEntry.file;
        console.log('Using manifest entry:', entryScript);

        // Collecter les CSS nécessaires pour cette page spécifique
        const cssFiles = new Set<string>();

        // 1. Ajouter le CSS de l'entrée principale (global styles)
        if (mainEntry.css && Array.isArray(mainEntry.css)) {
          mainEntry.css.forEach((cssFile: string) => cssFiles.add(cssFile));
        }

        // 2. Trouver et ajouter le CSS du chunk correspondant au composant
        const componentChunkKey = this.findChunkKeyForComponent(componentName);
        if (componentChunkKey && this.manifest[componentChunkKey]) {
          const componentChunk = this.manifest[componentChunkKey];
          if (componentChunk.css && Array.isArray(componentChunk.css)) {
            componentChunk.css.forEach((cssFile: string) => cssFiles.add(cssFile));
          }

          // 3. Ajouter le CSS des imports du chunk (dépendances)
          if (componentChunk.imports && Array.isArray(componentChunk.imports)) {
            componentChunk.imports.forEach((importKey: string) => {
              const importedChunk = this.manifest[importKey];
              if (importedChunk && importedChunk.css && Array.isArray(importedChunk.css)) {
                importedChunk.css.forEach((cssFile: string) => cssFiles.add(cssFile));
              }
            });
          }
        }

        // 4. Ajouter le CSS des chunks partagés (components, ui-components)
        const sharedChunks = ['_components-', '_ui-components-'];
        for (const [key, entry] of Object.entries(this.manifest)) {
          if (sharedChunks.some(prefix => key.startsWith(prefix))) {
            if (entry && typeof entry === 'object' && 'css' in entry && Array.isArray(entry.css)) {
              entry.css.forEach((cssFile: string) => cssFiles.add(cssFile));
            }
          }
        }

        // Générer les balises <link> pour les fichiers CSS nécessaires
        if (cssFiles.size > 0) {
          cssLinks = Array.from(cssFiles)
            .map(cssFile => `<link rel="stylesheet" href="/${cssFile}">`)
            .join('\n        ');
          console.log(`[CSS] Injecting ${cssFiles.size} CSS files for page ${componentName}`);
        }
      } else {
        console.warn('Manifest loaded but no entry found for src/view/entry-client.ts');
        console.log('Available manifest keys:', Object.keys(this.manifest));
      }
    } else {
      console.warn('No manifest loaded, using fallback script path');
    }

    return this.template
      .replace('<!--head-->', cssLinks)
      .replace('<!--app-->', '<div id="app"></div>')
      .replace('<!--scripts-->', `
        <script>
          window.__INITIAL_DATA__ = ${JSON.stringify(initialData)};
        </script>
        <script type="module" src="${entryScript}"></script>
      `);
  }

  /**
   * Trouve la clé du chunk correspondant au composant dans le manifest
   */
  private findChunkKeyForComponent(componentName: string): string | null {
    if (!this.manifest) return null;

    // Essayer de trouver le chunk par nom de fichier
    // Ex: "Articles" -> chercher "_feature-articles-" ou "src/view/features/articles/Articles.svelte"
    const possibleKeys = [
      `src/view/features/${componentName.toLowerCase()}/${componentName}.svelte`,
      `src/view/features/articles/${componentName}.svelte`,
      `src/view/features/stores/${componentName}.svelte`,
      `src/view/features/plannings/${componentName}.svelte`,
      `src/view/features/shopping-lists/${componentName}.svelte`,
      `src/view/features/recipes/${componentName}.svelte`,
      `src/view/features/ingredients/${componentName}.svelte`,
      `src/view/features/home/${componentName}.svelte`,
      `src/view/features/auth/${componentName}.svelte`,
      `src/view/features/profile/${componentName}.svelte`,
      `src/view/features/users/${componentName}.svelte`,
      `src/view/features/admin/${componentName}.svelte`,
      `src/view/features/privacy/${componentName}.svelte`,
      `src/view/features/legal/${componentName}.svelte`,
    ];

    // Vérifier les clés possibles
    for (const key of possibleKeys) {
      if (this.manifest[key]) {
        console.log(`[CSS] Found component chunk for ${componentName}: ${key}`);
        return key;
      }
    }

    // Chercher dans les chunks avec underscore (chunks précompilés)
    const chunkPattern = componentName.replace(/([A-Z])/g, '-$1').toLowerCase().substring(1);
    for (const key of Object.keys(this.manifest)) {
      // Ignorer les clés de déclaration CSS (qui finissent par !~{...}~.js)
      if (key.includes('!~{') && key.includes('}~.js')) {
        continue;
      }

      if (key.startsWith('_feature-') && key.includes(chunkPattern)) {
        console.log(`[CSS] Found precompiled chunk for ${componentName}: ${key}`);
        return key;
      }
    }

    console.warn(`[CSS] No chunk found for component ${componentName}`);
    return null;
  }

  private async renderDev(componentName: string, props: any): Promise<string> {
    // En développement, on utilise uniquement le client-side rendering avec Vite
    // Le SSR sera activé uniquement en production
    const initialData = {
      pageName: componentName,
      props: props
    };

    // Détecter le port Vite depuis la variable d'environnement ou utiliser 5173 par défaut
    const vitePort = process.env.VITE_PORT || '5173';

    // Template avec client-side rendering via Vite
    const html = this.template
      .replace('<!--app-->', '<div id="app"></div>')
      .replace('<!--head-->', '')
      .replace('<!--scripts-->', `
        <script type="module" src="http://localhost:${vitePort}/@vite/client"></script>
        <script type="module">
          window.__INITIAL_DATA__ = ${JSON.stringify(initialData)};
        </script>
        <script type="module" src="http://localhost:${vitePort}/src/view/entry-client.ts"></script>
      `);

    return html;
  }

  private injectHtml(html: string, css: any, head: string, componentName: string, props: any): string {
    const initialData = {
      pageName: componentName,
      props: props
    };

    return this.template
      .replace('<!--head-->', head || '')
      .replace('<!--app-->', html)
      .replace('<!--scripts-->', `
        <script>
          window.__INITIAL_DATA__ = ${JSON.stringify(initialData)};
        </script>
        <script type="module" src="/assets/entry-client.js"></script>
      `);
  }
}
