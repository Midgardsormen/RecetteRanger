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
    manifest: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/view/entry-client.ts')
      },
      output: {
        manualChunks: {
          // Split vendor code
          'vendor-svelte': ['svelte'],
          // Each page as a separate chunk
          'page-home': ['./src/view/pages/Home.svelte'],
          'page-recettes': ['./src/view/pages/Recettes.svelte'],
          'page-plannings': ['./src/view/pages/Plannings.svelte'],
          'page-shopping-lists': ['./src/view/pages/ShoppingLists.svelte'],
          // Shared components
          'components': [
            './src/view/shared/components/Layout.svelte',
            './src/view/shared/components/Navigation.svelte'
          ]
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  },
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
