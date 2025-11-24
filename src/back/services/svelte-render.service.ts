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
      const manifestPath = join(__dirname, '../../client/manifest.json');
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
      const manifestPath = join(__dirname, '../../client/manifest.json');
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
          const clientDir = join(__dirname, '../../client');
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
    if (this.manifest) {
      // Le manifest Vite a cette structure: { "src/view/entry-client.ts": { "file": "assets/main-ABC123.js", ... } }
      const mainEntry = this.manifest['src/view/entry-client.ts'];
      if (mainEntry && mainEntry.file) {
        entryScript = '/' + mainEntry.file;
        console.log('Using manifest entry:', entryScript);
      } else {
        console.warn('Manifest loaded but no entry found for src/view/entry-client.ts');
        console.log('Available manifest keys:', Object.keys(this.manifest));
      }
    } else {
      console.warn('No manifest loaded, using fallback script path');
    }

    return this.template
      .replace('<!--head-->', '')
      .replace('<!--app-->', '<div id="app"></div>')
      .replace('<!--scripts-->', `
        <script>
          window.__INITIAL_DATA__ = ${JSON.stringify(initialData)};
        </script>
        <script type="module" src="${entryScript}"></script>
      `);
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
