# FormDrawer

Composant réutilisable pour créer des drawers de formulaire avec gestion des doublons, validation et états de chargement.

## Fonctionnalités

- ✅ Gestion automatique des boutons primaire/secondaire
- ✅ Affichage des doublons potentiels avec alerte
- ✅ État de chargement pendant la sauvegarde
- ✅ Désactivation automatique pendant la vérification des doublons
- ✅ Messages personnalisables
- ✅ Support mode création/édition

## Utilisation

### Exemple de base

```svelte
<script lang="ts">
  import { FormDrawer, Input } from '../../components/ui';

  let isOpen = $state(false);
  let name = $state('');
  let saving = $state(false);
  let errors = $state<Record<string, string>>({});

  async function handleSave() {
    saving = true;
    try {
      // Votre logique de sauvegarde
      await apiService.create({ name });
      isOpen = false;
    } catch (error) {
      errors.name = 'Erreur lors de la sauvegarde';
    } finally {
      saving = false;
    }
  }
</script>

<FormDrawer
  isOpen={isOpen}
  title="Créer un article"
  mode="create"
  {saving}
  {errors}
  onSave={handleSave}
  onClose={() => isOpen = false}
>
  <Input
    label="Nom"
    bind:value={name}
    error={errors.name}
  />
</FormDrawer>
```

### Avec détection de doublons

```svelte
<script lang="ts">
  import { FormDrawer, Input, Alert } from '../../components/ui';
  import type { DuplicateItem } from '../../types/ui.types';

  let isOpen = $state(false);
  let name = $state('');
  let saving = $state(false);
  let checkingDuplicates = $state(false);
  let duplicates = $state<DuplicateItem[]>([]);
  let errors = $state<Record<string, string>>({});

  async function checkDuplicates() {
    if (name.length < 2) {
      duplicates = [];
      return;
    }

    checkingDuplicates = true;
    try {
      const result = await apiService.checkDuplicates(name);
      duplicates = result.similar;
    } finally {
      checkingDuplicates = false;
    }
  }

  let duplicateCheckTimeout: ReturnType<typeof setTimeout>;

  function handleNameInput() {
    clearTimeout(duplicateCheckTimeout);
    duplicateCheckTimeout = setTimeout(checkDuplicates, 500);
  }
</script>

<FormDrawer
  isOpen={isOpen}
  title="Créer un ingrédient"
  mode="create"
  {saving}
  {errors}
  {duplicates}
  {checkingDuplicates}
  duplicateMessage="Des ingrédients similaires existent. Voulez-vous continuer ?"
  onSave={handleSave}
  onClose={() => isOpen = false}
>
  <Input
    label="Nom"
    bind:value={name}
    oninput={handleNameInput}
    error={errors.name}
  />
</FormDrawer>
```

### Mode édition

```svelte
<FormDrawer
  isOpen={isOpen}
  title="Modifier l'article"
  mode="edit"
  {saving}
  {errors}
  onSave={handleSave}
  onClose={() => isOpen = false}
>
  <!-- Vos champs de formulaire -->
</FormDrawer>
```

### Labels personnalisés

```svelte
<FormDrawer
  isOpen={isOpen}
  title="Nouvel article"
  mode="create"
  {saving}
  saveLabel="Ajouter"
  cancelLabel="Fermer"
  onSave={handleSave}
  onClose={() => isOpen = false}
>
  <!-- Vos champs de formulaire -->
</FormDrawer>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | `false` | Contrôle l'ouverture du drawer |
| `title` | `string` | **required** | Titre du drawer |
| `mode` | `'create' \| 'edit'` | `'create'` | Mode du formulaire |
| `saving` | `boolean` | `false` | État de sauvegarde |
| `errors` | `Record<string, string>` | `{}` | Erreurs de validation |
| `duplicates` | `DuplicateItem[]` | `[]` | Liste des doublons potentiels |
| `checkingDuplicates` | `boolean` | `false` | État de vérification des doublons |
| `duplicateMessage` | `string` | Auto | Message d'avertissement doublons |
| `onSave` | `() => void \| Promise<void>` | **required** | Callback de sauvegarde |
| `onClose` | `() => void` | **required** | Callback de fermeture |
| `saveLabel` | `string` | Auto | Label bouton primaire |
| `cancelLabel` | `string` | `'Annuler'` | Label bouton secondaire |
| `children` | `Snippet` | - | Contenu du formulaire |

## Structure

```
FormDrawer/
├── FormDrawer.svelte      # Composant principal
├── FormDrawer.config.ts   # Configuration et constantes
└── README.md              # Documentation
```

## Patterns communs

### Reset du formulaire à l'ouverture

```svelte
$effect(() => {
  if (isOpen) {
    if (item) {
      // Mode édition
      name = item.name;
    } else {
      // Mode création
      name = '';
    }
    errors = {};
    duplicates = [];
  }
});
```

### Validation avant sauvegarde

```svelte
function validate(): boolean {
  errors = {};
  let isValid = true;

  if (name.trim().length < 2) {
    errors.name = 'Le nom doit contenir au moins 2 caractères';
    isValid = false;
  }

  return isValid;
}

async function handleSave() {
  if (!validate()) return;

  saving = true;
  // ... logique de sauvegarde
}
```
