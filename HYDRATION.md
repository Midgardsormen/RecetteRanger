# Système d'Hydratation Sélective

Ce projet utilise un système d'hydratation sélective pour optimiser les performances en ne chargeant JavaScript que pour les composants qui en ont vraiment besoin.

## 📋 Vue d'ensemble

### Qu'est-ce que l'hydratation sélective ?

Plutôt que d'envoyer tout le JavaScript au client et de monter toute l'application côté client, nous :

1. **SSR (Server-Side Rendering)** : Le serveur rend le HTML complet de la page
2. **Hydratation sélective** : Le client ne "réveille" que les composants interactifs nécessaires
3. **Composants statiques** : Les composants sans interactivité restent du HTML pur

### Avantages

- ✅ **Performance** : Moins de JavaScript à télécharger et exécuter
- ✅ **Flexibilité** : Contrôle précis sur ce qui est interactif
- ✅ **SEO** : HTML complet rendu côté serveur
- ✅ **Progressive Enhancement** : Le site fonctionne même si JavaScript échoue

## 🏗️ Architecture

### Fichiers clés

```
src/view/
├── entry-client.ts              # Point d'entrée client (hydratation)
├── entry-server.ts              # Point d'entrée serveur (SSR)
├── hydration-registry.ts        # Registre des composants à hydrater
└── shared/
    ├── utils/
    │   └── hydration.ts         # Utilitaires d'hydratation
    └── components/
        ├── Navigation.svelte    # Composant avec id="navigation"
        └── Navigation.ts        # Module d'hydratation pour Navigation
```

## 🚀 Utilisation

### 1. Créer un composant qui nécessite l'hydratation

**Exemple : `MyComponent.svelte`**

```svelte
<script lang="ts">
  let { count = 0 }: { count?: number } = $props();

  function increment() {
    count++;
  }
</script>

<!-- Important : Ajouter un id unique pour l'hydratation -->
<div id="my-component" class="my-component">
  <p>Count: {count}</p>
  <button onclick={increment}>Increment</button>
</div>

<style>
  /* styles */
</style>
```

**Points importants :**
- Ajoutez un `id` unique à l'élément racine du composant
- Cet `id` sera utilisé pour cibler le composant lors de l'hydratation

### 2. Créer le module d'hydratation

**Créer `MyComponent.ts` à côté de `MyComponent.svelte` :**

```typescript
import { hydrateComponent, whenReady } from '@/shared/utils/hydration';
import MyComponent from './MyComponent.svelte';

export function hydrateMyComponent() {
  whenReady(() => {
    hydrateComponent({
      component: MyComponent,
      target: '#my-component',
      props: {
        count: 0
      },
      recover: true
    });
  });
}

// Auto-hydrate quand ce module est importé
hydrateMyComponent();
```

### 3. Enregistrer dans le registre d'hydratation

**Modifier `src/view/hydration-registry.ts` :**

```typescript
export const hydrationRegistry: Record<string, HydrationModule> = {
  // Composant global (toutes les pages)
  navigation: {
    load: () => import('@/shared/components/Navigation'),
    global: true
  },

  // Composant spécifique à certaines pages
  myComponent: {
    load: () => import('@/components/MyComponent'),
    pages: ['Home', 'Recettes']  // Seulement sur ces pages
  },
};
```

### 4. Options de configuration

#### Hydratation globale

Pour un composant qui doit être hydraté sur **toutes les pages** :

```typescript
{
  load: () => import('@/shared/components/Navigation'),
  global: true
}
```

#### Hydratation par page

Pour un composant qui doit être hydraté sur **certaines pages spécifiques** :

```typescript
{
  load: () => import('@/components/RecipeForm'),
  pages: ['Recettes', 'Plannings']
}
```

## 🎯 Décider si un composant doit être hydraté

### ✅ Hydrater si le composant :

- A des événements utilisateur (`onclick`, `oninput`, etc.)
- Maintient un état local qui change (`$state`)
- A des animations ou transitions complexes
- Utilise des APIs du navigateur (localStorage, fetch, etc.)

### ❌ Ne PAS hydrater si le composant :

- Est purement statique (juste du HTML/CSS)
- N'a pas d'interactivité
- Affiche seulement du contenu

**Exemple :**

```svelte
<!-- Composant statique - PAS besoin d'hydratation -->
<div class="hero">
  <h1>Bienvenue</h1>
  <p>Description statique</p>
</div>

<!-- Composant interactif - BESOIN d'hydratation -->
<div id="search-bar">
  <input oninput={handleSearch} />
  <button onclick={submit}>Rechercher</button>
</div>
```

## 📝 Bonnes pratiques

### 1. Nommage des IDs

Utilisez des IDs descriptifs et uniques :

```svelte
✅ <nav id="navigation">
✅ <form id="recipe-form">
✅ <div id="shopping-cart">

❌ <div id="comp1">
❌ <div id="thing">
```

### 2. Props et hydratation

Si votre composant a besoin de props dynamiques, vous pouvez :

**Option A : Props hardcodées**
```typescript
hydrateComponent({
  component: MyComponent,
  target: '#my-component',
  props: { count: 10 }
});
```

**Option B : Props depuis data-attributes**
```svelte
<!-- Côté serveur -->
<div id="my-component" data-props={JSON.stringify({ count: 10 })}>
  ...
</div>
```

```typescript
// Côté client - les props seront automatiquement lues
hydrateComponent({
  component: MyComponent,
  target: '#my-component'
  // props sera lu depuis data-props
});
```

### 3. Gestion d'erreurs

L'option `recover: true` permet à Svelte de récupérer si le DOM ne correspond pas exactement :

```typescript
hydrateComponent({
  component: MyComponent,
  target: '#my-component',
  recover: true  // Recommandé en production
});
```

### 4. Lazy loading

Le système charge automatiquement les modules de manière asynchrone :

```typescript
// Cette fonction retourne une Promise
load: () => import('@/components/MyComponent')
```

Les composants sont chargés en parallèle pour optimiser les performances.

## 🔍 Debugging

### Console logs

Le système affiche des logs utiles :

```
[Client] Initializing page: Home
[Hydration] Loading 2 component(s) for page: Home
[Hydration] Successfully hydrated component at #navigation
[Hydration] Successfully hydrated component at #my-component
[Hydration] Completed hydration for page: Home
[Client] Page Home ready
```

### Vérifier qu'un composant est hydraté

Ouvrez la console du navigateur et cherchez les messages `[Hydration]`.

### Erreurs courantes

#### "Target element not found"

```
[Hydration] Target element not found: #my-component
```

**Solution :** Vérifiez que l'`id` dans le composant Svelte correspond à celui dans le module d'hydratation.

#### "Failed to parse data-props"

```
[Hydration] Failed to parse data-props: ...
```

**Solution :** Assurez-vous que `data-props` contient du JSON valide.

## 📊 Exemple complet

### 1. Composant Svelte

**`src/view/components/Counter.svelte`**

```svelte
<script lang="ts">
  let { initialCount = 0 }: { initialCount?: number } = $props();
  let count = $state(initialCount);
</script>

<div id="counter" class="counter">
  <h2>Counter</h2>
  <p>Count: {count}</p>
  <button onclick={() => count++}>+1</button>
  <button onclick={() => count--}>-1</button>
</div>

<style>
  .counter {
    padding: 1rem;
    border: 2px solid #667eea;
    border-radius: 8px;
  }
</style>
```

### 2. Module d'hydratation

**`src/view/components/Counter.ts`**

```typescript
import { hydrateComponent, whenReady } from '@/shared/utils/hydration';
import Counter from './Counter.svelte';

export function hydrateCounter() {
  whenReady(() => {
    hydrateComponent({
      component: Counter,
      target: '#counter',
      recover: true
    });
  });
}

hydrateCounter();
```

### 3. Enregistrement

**`src/view/hydration-registry.ts`**

```typescript
export const hydrationRegistry: Record<string, HydrationModule> = {
  navigation: {
    load: () => import('@/shared/components/Navigation'),
    global: true
  },

  counter: {
    load: () => import('@/components/Counter'),
    pages: ['Home']  // Seulement sur la page d'accueil
  },
};
```

### 4. Utilisation dans une page

**`src/view/pages/Home.svelte`**

```svelte
<script lang="ts">
  import Layout from '@/shared/components/Layout.svelte';
  import Counter from '@/components/Counter.svelte';
</script>

<Layout title="Home" currentPage="/">
  <h1>Welcome to RecetteRanger</h1>

  <!-- Ce composant sera automatiquement hydraté -->
  <Counter initialCount={5} />
</Layout>
```

## 🎓 Ressources

- [Svelte Documentation - Hydration](https://svelte.dev/docs/svelte/hydrate)
- [Code Splitting Guide](./CODE_SPLITTING.md)
- [Vite Documentation](https://vitejs.dev/)

## ❓ FAQ

### Pourquoi ne pas simplement tout hydrater ?

Hydrater toute l'application consomme plus de bande passante et de ressources CPU. L'hydratation sélective améliore les performances, surtout sur mobile.

### Que se passe-t-il si je n'hydrate pas un composant interactif ?

Le composant sera rendu en HTML statique. Les événements (`onclick`, etc.) ne fonctionneront pas.

### Puis-je hydrater un composant manuellement plus tard ?

Oui ! Commentez simplement l'auto-hydratation dans le fichier `.ts` et appelez la fonction quand vous voulez :

```typescript
// Ne pas auto-hydrater
// hydrateMyComponent();

// Exporter pour utilisation manuelle
export { hydrateMyComponent };
```

```typescript
// Ailleurs dans votre code
import { hydrateMyComponent } from '@/components/MyComponent';

// Hydrater quand nécessaire
setTimeout(() => {
  hydrateMyComponent();
}, 2000);
```
