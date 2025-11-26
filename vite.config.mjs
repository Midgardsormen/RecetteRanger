import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'path';
import sveltePreprocess from 'svelte-preprocess';

export default defineConfig({
  plugins: [
    svelte({
      preprocess: sveltePreprocess({
        typescript: {
          tsconfigFile: './tsconfig.client.json'
        }
      })
    })
  ],
  build: {
    outDir: 'dist/client',
    manifest: 'manifest.json',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/view/entry-client.ts')
      },
      output: {
        manualChunks: {
          // Split vendor code
          'vendor-svelte': ['svelte'],
          'vendor-cropperjs': ['cropperjs'],
          // Each feature as a separate chunk
          'feature-home': ['./src/view/features/home/Home.svelte'],
          'feature-recipes': ['./src/view/features/recipes/Recipes.svelte'],
          'feature-recipe-detail': ['./src/view/features/recipes/RecipeDetail.svelte'],
          'feature-ingredients': ['./src/view/features/ingredients/Ingredients.svelte'],
          'feature-meal-planning': ['./src/view/features/plannings/MealPlanning.svelte'],
          'feature-meal-planning-settings': ['./src/view/features/plannings/MealPlanningSettings.svelte'],
          'feature-shopping-lists': ['./src/view/features/shopping-lists/ShoppingLists.svelte'],
          'feature-auth-login': ['./src/view/features/auth/Login.svelte'],
          'feature-auth-register': ['./src/view/features/auth/Register.svelte'],
          // UI Components
          'ui-components': [
            './src/view/components/ui/Drawer/Drawer.svelte',
            './src/view/components/ui/Modal/Modal.svelte',
            './src/view/components/ui/ImageUpload/ImageUpload.svelte'
          ],
          // Shared components
          'components': [
            './src/view/layouts/Layout.svelte',
            './src/view/features/navigation/Navigation.svelte'
          ]
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  },
  publicDir: 'public', // Servir le dossier public/ en développement
  server: {
    port: 5173,
    strictPort: true, // Ne pas chercher un autre port si 5173 est occupé
    cors: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src/view')
    }
  }
});
