# Code Splitting & Lazy Loading

This project now supports **code splitting** and **lazy loading** for optimal performance.

## How It Works

### 1. **Automatic Code Splitting**

Each page is built as a separate JavaScript module:

```
dist/client/assets/
├── vendor-svelte-[hash].js      (31 KB) - Svelte framework
├── components-[hash].js         (1.6 KB) - Shared components
├── page-home-[hash].js          (1.6 KB) - Home page
├── page-recettes-[hash].js      (1.7 KB) - Recipes page
├── page-plannings-[hash].js     (1.3 KB) - Plannings page
├── page-shopping-lists-[hash].js (1.3 KB) - Shopping lists page
└── main-[hash].js               (2.6 KB) - Entry point
```

### 2. **Lazy Loading**

Pages are loaded **on-demand** when requested:

```typescript
// Only the requested page is downloaded
const pageModule = await pages[pageName]();
```

### 3. **Benefits**

- **Faster Initial Load**: Only main.js + vendor-svelte.js are loaded initially (~34 KB total)
- **Better Caching**: Each page can be cached independently
- **Reduced Bandwidth**: Users only download pages they visit
- **Scalability**: Add more pages without increasing initial bundle size

### 4. **Configuration**

Code splitting is configured in `vite.config.mjs`:

```javascript
manualChunks: {
  'vendor-svelte': ['svelte'],
  'page-home': ['./src/client/pages/Home.svelte'],
  'page-recettes': ['./src/client/pages/Recettes.svelte'],
  'page-plannings': ['./src/client/pages/Plannings.svelte'],
  'page-shopping-lists': ['./src/client/pages/ShoppingLists.svelte'],
  'components': [
    './src/client/components/Layout.svelte',
    './src/client/components/Navigation.svelte'
  ]
}
```

### 5. **Adding New Pages**

To add a new page with automatic code splitting:

1. Create your page component: `src/client/pages/NewPage.svelte`
2. Add to `entry-pages.ts`:
   ```typescript
   export const pages = {
     // ...
     NewPage: () => import('./pages/NewPage.svelte')
   };

   export { default as NewPage } from './pages/NewPage.svelte';
   ```
3. Add to `vite.config.mjs` manualChunks:
   ```javascript
   'page-new': ['./src/client/pages/NewPage.svelte']
   ```
4. Add route in `app.controller.ts`

The new page will automatically be:
- Split into its own bundle
- Lazy loaded when accessed
- Cached independently

### 6. **Development Mode**

In development mode, Vite handles code splitting automatically with HMR (Hot Module Replacement) support.

### 7. **Production Mode**

In production, run `npm run build` to generate optimized, split bundles with:
- Minification
- Tree shaking
- Hash-based filenames for cache busting
- Separate CSS files per chunk
