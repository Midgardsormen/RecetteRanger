# UI Components

Composants UI génériques et réutilisables avec support complet de l'accessibilité (a11y).

## Drawer

Panneau latéral qui glisse depuis la droite de l'écran.

### Utilisation

```svelte
<script>
  import { Drawer } from '$view/components/ui';

  let isOpen = $state(false);
</script>

<Drawer
  {isOpen}
  title="Mon Drawer"
  onClose={() => isOpen = false}
  showBackButton={false}
  primaryAction={{
    label: 'Enregistrer',
    onClick: handleSave,
    disabled: false,
    loading: false
  }}
  secondaryAction={{
    label: 'Annuler',
    onClick: () => isOpen = false
  }}
>
  <!-- Contenu du drawer -->
  <p>Votre contenu ici</p>
</Drawer>
```

### Props

- `isOpen` (boolean): État d'ouverture du drawer
- `title` (string): Titre affiché dans le header
- `showBackButton` (boolean): Afficher le bouton retour
- `onClose` (function): Callback de fermeture (requis)
- `onBack` (function): Callback du bouton retour
- `primaryAction` (object): Action principale (bouton)
  - `label` (string): Texte du bouton
  - `onClick` (function): Callback au clic
  - `disabled` (boolean): Bouton désactivé
  - `loading` (boolean): État de chargement
- `secondaryAction` (object): Action secondaire (bouton)
  - `label` (string): Texte du bouton
  - `onClick` (function): Callback au clic
  - `disabled` (boolean): Bouton désactivé

### Fonctionnalités

✅ Animation de glissement depuis la droite
✅ Trap focus pour l'accessibilité
✅ Fermeture avec Escape
✅ Fermeture au clic sur l'overlay
✅ Scroll interne avec scrollbar personnalisée
✅ Bloque le scroll du body
✅ Support ARIA (role="dialog", aria-modal)

---

## Modal

Dialogue centré au milieu de l'écran.

### Utilisation

```svelte
<script>
  import { Modal } from '$view/components/ui';

  let isOpen = $state(false);
</script>

<Modal
  {isOpen}
  title="Confirmation"
  size="medium"
  showCloseButton={true}
  onClose={() => isOpen = false}
  primaryAction={{
    label: 'Confirmer',
    onClick: handleConfirm
  }}
  secondaryAction={{
    label: 'Annuler',
    onClick: () => isOpen = false
  }}
  dangerAction={{
    label: 'Supprimer',
    onClick: handleDelete
  }}
>
  <!-- Contenu de la modal -->
  <p>Êtes-vous sûr de vouloir continuer ?</p>
</Modal>
```

### Props

- `isOpen` (boolean): État d'ouverture de la modal
- `title` (string): Titre affiché dans le header
- `size` ('small' | 'medium' | 'large'): Taille de la modal
- `showCloseButton` (boolean): Afficher le bouton fermer (croix)
- `onClose` (function): Callback de fermeture (requis)
- `primaryAction` (object): Action principale (bouton)
  - `label` (string): Texte du bouton
  - `onClick` (function): Callback au clic
  - `disabled` (boolean): Bouton désactivé
  - `loading` (boolean): État de chargement
- `secondaryAction` (object): Action secondaire (bouton)
  - `label` (string): Texte du bouton
  - `onClick` (function): Callback au clic
  - `disabled` (boolean): Bouton désactivé
- `dangerAction` (object): Action dangereuse (bouton rouge)
  - `label` (string): Texte du bouton
  - `onClick` (function): Callback au clic
  - `disabled` (boolean): Bouton désactivé

### Tailles

- **small**: max-width 400px - Pour confirmations simples
- **medium**: max-width 600px - Usage général (défaut)
- **large**: max-width 900px - Pour formulaires complexes

### Fonctionnalités

✅ Animation scale + fade in
✅ Trap focus pour l'accessibilité
✅ Fermeture avec Escape
✅ Fermeture au clic sur l'overlay
✅ Scroll interne avec scrollbar personnalisée
✅ Bloque le scroll du body
✅ Support ARIA (role="dialog", aria-modal)
✅ 3 types d'actions (primaire, secondaire, danger)
✅ Responsive (plein écran sur mobile)

---

## Focus Trap Utility

Utilitaire réutilisable pour gérer le piégeage du focus (utilisé par Drawer et Modal).

### Utilisation directe

```typescript
import { createFocusTrap } from '$view/utils';

const focusTrap = createFocusTrap({
  element: myElement,
  onEscape: () => console.log('Escape pressed'),
  autoFocus: true
});

// Activer
focusTrap.activate();

// Désactiver
focusTrap.deactivate();
```

### Fonctionnalités

✅ Piège le focus dans un élément (Tab/Shift+Tab)
✅ Gestion de la touche Escape
✅ Auto-focus sur le premier élément focusable
✅ Restauration du focus précédent à la fermeture
✅ Mise à jour dynamique de l'élément

---

## Bonnes pratiques

### Accessibilité

1. **Toujours fournir un titre** pour les lecteurs d'écran
2. **Utiliser les actions appropriées**:
   - Primary: Action principale (ex: "Enregistrer", "Confirmer")
   - Secondary: Action d'annulation (ex: "Annuler", "Retour")
   - Danger: Actions destructives (ex: "Supprimer", "Désactiver")
3. **Labels clairs**: Éviter "OK", préférer "Enregistrer la recette"

### Performance

1. **Lazy loading**: Ne pas monter le drawer/modal tant qu'il n'est pas nécessaire
2. **Éviter les re-renders**: Utiliser `$state` et `$effect` de Svelte 5
3. **Cleanup**: Les composants nettoient automatiquement (scroll, focus, listeners)

### UX

1. **Drawer**: Pour les formulaires longs ou éditions complexes
2. **Modal**: Pour les confirmations rapides ou petits formulaires
3. **Ne pas imbriquer**: Éviter drawer dans drawer ou modal dans modal
