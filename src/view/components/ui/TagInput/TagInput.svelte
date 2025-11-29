<script lang="ts">
  import { Input } from '../form';
  import Button from '../Button.svelte';
  import Tag from '../Tag';
  import { TAG_INPUT_DEFAULTS, TAG_INPUT_ARIA } from './TagInput.config';
  import { addItem, removeItem, handleKeydown } from './TagInput.actions';

  interface Props {
    /**
     * Identifiant unique du champ
     */
    id?: string;

    /**
     * Liste des éléments actuels
     */
    items?: string[];

    /**
     * Callback appelé lors de la mise à jour de la liste
     */
    onUpdate?: (items: string[]) => void;

    /**
     * Placeholder du champ de saisie
     */
    placeholder?: string;

    /**
     * Label du bouton d'ajout
     */
    addButtonLabel?: string;

    /**
     * Variante visuelle (pour fonds clairs/foncés)
     */
    variant?: 'default' | 'inverse';

    /**
     * Variante de couleur des tags
     */
    tagVariant?: 'neutral' | 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'primary-inverse' | 'info-inverse';

    /**
     * Taille des tags
     */
    tagSize?: 'xs' | 'small' | 'medium' | 'large';
  }

  let {
    id,
    items = [],
    onUpdate = () => {},
    placeholder = TAG_INPUT_DEFAULTS.placeholder,
    addButtonLabel = TAG_INPUT_DEFAULTS.addButtonLabel,
    variant = TAG_INPUT_DEFAULTS.variant,
    tagVariant = TAG_INPUT_DEFAULTS.tagVariant,
    tagSize = TAG_INPUT_DEFAULTS.tagSize
  }: Props = $props();

  // État local pour la valeur de l'input
  let inputValue = $state('');

  // Détermine le variant du bouton selon le variant général
  const buttonVariant = $derived(variant === 'inverse' ? 'outlined-inverse' : 'outlined');

  // Détermine le variant du tag selon le variant général (si non spécifié explicitement)
  const computedTagVariant = $derived(
    tagVariant || (variant === 'inverse' ? 'primary-inverse' : 'neutral')
  );

  // Gestionnaires d'événements
  function handleAdd() {
    inputValue = addItem(inputValue, items, onUpdate);
  }

  function handleRemove(index: number) {
    removeItem(index, items, onUpdate);
  }

  function handleInputKeydown(e: KeyboardEvent) {
    handleKeydown(e, inputValue, items, onUpdate, (newValue) => {
      inputValue = newValue;
    });
  }
</script>

<div class="tag-input" class:tag-input--inverse={variant === 'inverse'}>
  <div class="tag-input__input-group">
    <Input
      {id}
      type="text"
      value={inputValue}
      oninput={(e) => { inputValue = e.currentTarget.value; }}
      {placeholder}
      onkeydown={handleInputKeydown}
    />
    <Button
      variant={buttonVariant}
      onclick={handleAdd}
      disabled={!inputValue.trim()}
      aria-label={TAG_INPUT_ARIA.addButton}
    >
      {addButtonLabel}
    </Button>
  </div>

  {#if items.length > 0}
    <div class="tag-input__tags">
      {#each items as item, index}
        <Tag
          variant={computedTagVariant}
          size={tagSize}
          removable
          onRemove={() => handleRemove(index)}
        >
          {item}
        </Tag>
      {/each}
    </div>
  {/if}
</div>

<style lang="scss">
  @use '../../../styles/variables' as *;

  // Block: tag-input
  .tag-input {
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;

    // Element: input-group (input + button)
    &__input-group {
      display: flex;
      gap: $spacing-2xs;
      align-items: flex-end;

      // Mobile first: stack on small screens
      @media (max-width: $breakpoint-sm) {
        flex-direction: column;
        align-items: stretch;
      }
    }

    // Element: tags container
    &__tags {
      display: flex;
      flex-wrap: wrap;
      gap: $spacing-2xs;
    }

    // Modifier: inverse variant (for dark backgrounds)
    &--inverse {
      // Styles spécifiques au variant inverse si nécessaire
      // Les composants enfants (Input, Button, Tag) gèrent déjà leur propre variant
    }
  }
</style>
