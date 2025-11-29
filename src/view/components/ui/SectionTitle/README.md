# SectionTitle

Composant réutilisable pour les titres de section avec support automatique du variant inverse dans les drawers.

## Fonctionnalités

- ✅ Plusieurs niveaux de titre (h2, h3, h4)
- ✅ Variant inverse pour fonds foncés
- ✅ Auto-inverse dans les drawers
- ✅ Typographie cohérente
- ✅ Mobile first & responsive

## Utilisation

### Exemple de base

```svelte
<script lang="ts">
  import { SectionTitle } from '../../components/ui';
</script>

<SectionTitle>Informations générales</SectionTitle>
```

### Différents niveaux

```svelte
<!-- Titre de section principal (h2) -->
<SectionTitle level={2}>Section principale</SectionTitle>

<!-- Sous-section (h3) -->
<SectionTitle level={3}>Sous-section</SectionTitle>

<!-- Titre de sous-sous-section (h4) -->
<SectionTitle level={4}>Détails</SectionTitle>
```

### Variant inverse (fond foncé)

```svelte
<!-- Sur fond foncé -->
<div style="background: #244428; padding: 1rem;">
  <SectionTitle variant="inverse">
    Titre sur fond foncé
  </SectionTitle>
</div>
```

### Dans un Drawer (auto-inverse)

```svelte
<FormDrawer
  isOpen={isOpen}
  title="Créer un article"
  onSave={handleSave}
  onClose={() => isOpen = false}
>
  <!-- Automatiquement en blanc sur fond vert foncé -->
  <SectionTitle>Informations de base</SectionTitle>

  <Input label="Nom" bind:value={name} />

  <SectionTitle level={3}>Options avancées</SectionTitle>

  <Checkbox label="Option 1" bind:checked={option1} />
</FormDrawer>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `level` | `2 \| 3 \| 4` | `2` | Niveau de titre HTML (h2, h3, h4) |
| `variant` | `'default' \| 'inverse'` | `'default'` | Variant de couleur |
| `children` | `Snippet` | - | Contenu du titre |

## Niveaux de titre

- **Level 2 (h2)** : Titre de section principal
  - Mobile: 18px (1.125rem)
  - Desktop: 20px (1.25rem)

- **Level 3 (h3)** : Sous-section
  - Mobile: 18px (1.125rem)
  - Desktop: 20px (1.25rem)

- **Level 4 (h4)** : Détails/sous-sous-section
  - Mobile: 18px (1.125rem)
  - Desktop: 20px (1.25rem)

## Variants

### Default
- Couleur : `$color-text-primary` (#333333)
- Usage : Fonds clairs (blanc, crème)

### Inverse
- Couleur : `$color-text-inverse` (blanc)
- Usage : Fonds foncés (vert primaire, noir)
- **Auto-appliqué** dans les drawers !

## Auto-inverse dans les Drawers

Le composant s'adapte automatiquement quand il est dans un Drawer :

```svelte
<!-- Pas besoin de spécifier variant="inverse" -->
<Drawer isOpen={true}>
  <SectionTitle>Mon titre</SectionTitle>
  <!-- ☝️ Automatiquement en blanc ! -->
</Drawer>

<FormDrawer isOpen={true}>
  <SectionTitle>Mon titre</SectionTitle>
  <!-- ☝️ Automatiquement en blanc ! -->
</FormDrawer>
```

## Structure

```
SectionTitle/
├── SectionTitle.svelte      # Composant principal
├── SectionTitle.config.ts   # Configuration et constantes
└── README.md                # Documentation
```

## Exemples d'utilisation

### Dans un formulaire de création

```svelte
<FormDrawer
  isOpen={isOpen}
  title="Créer un ingrédient"
  onSave={handleSave}
  onClose={handleClose}
>
  <SectionTitle>Informations de base</SectionTitle>
  <Input label="Nom" bind:value={name} />
  <Select label="Rayon" bind:value={aisle} options={aisles} />

  <SectionTitle level={3}>Unités disponibles</SectionTitle>
  <Checkbox label="Grammes" bind:checked={units.g} />
  <Checkbox label="Kilogrammes" bind:checked={units.kg} />

  <SectionTitle level={3}>Saisonnalité</SectionTitle>
  <!-- Sélecteur de mois -->
</FormDrawer>
```

### Dans un drawer multi-étapes

```svelte
<Drawer isOpen={isOpen}>
  {#if currentStep === 1}
    <SectionTitle>Étape 1 : Informations générales</SectionTitle>
    <!-- Formulaire étape 1 -->
  {:else if currentStep === 2}
    <SectionTitle>Étape 2 : Ingrédients</SectionTitle>
    <!-- Formulaire étape 2 -->
  {:else}
    <SectionTitle>Étape 3 : Instructions</SectionTitle>
    <!-- Formulaire étape 3 -->
  {/if}
</Drawer>
```
