<script lang="ts">
  import { Input, Button } from '../../components/ui';
  import Textarea from '../../components/ui/form/Textarea.svelte';
  import type { RecipeFormData, StepInput } from '../../types/recipe.types';
  import { appendToList, removeFromList, updateInList, moveUpInList, moveDownInList } from '../../utils/listManagement';

  interface Props {
    formData: RecipeFormData;
    errors: Record<string, string>;
    onUpdate: (updates: Partial<RecipeFormData>) => void;
  }

  let { formData, errors, onUpdate }: Props = $props();

  // Référence à un conteneur des étapes pour le scroll
  let stepsContainer: HTMLDivElement | null = null;
  let previousStepsLength = $state(0);

  // Observer les changements de nombre d'étapes pour scroller automatiquement
  $effect(() => {
    const currentLength = formData.steps.length;

    // Si une étape a été ajoutée
    if (currentLength > previousStepsLength && stepsContainer) {
      // Scroller vers le dernier enfant après un court délai
      setTimeout(() => {
        const lastChild = stepsContainer?.lastElementChild as HTMLElement;
        if (lastChild) {
          lastChild.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }

    previousStepsLength = currentLength;
  });

  // Gestion des étapes de préparation
  function addStep() {
    const newStep: StepInput = {
      description: '',
      durationMinutes: ''
    };
    appendToList(newStep, formData.steps, (updated) => {
      onUpdate({ steps: updated });
    });
  }

  function removeStep(index: number) {
    removeFromList(index, formData.steps, (updated) => {
      onUpdate({ steps: updated });
    });
  }

  function moveStepUp(index: number) {
    moveUpInList(index, formData.steps, (updated) => {
      onUpdate({ steps: updated });
    });
  }

  function moveStepDown(index: number) {
    moveDownInList(index, formData.steps, (updated) => {
      onUpdate({ steps: updated });
    });
  }

  function updateStep(index: number, updates: Partial<StepInput>) {
    updateInList(index, updates, formData.steps, (updated) => {
      onUpdate({ steps: updated });
    });
  }
</script>

<div class="recipe-step3">
  {#if errors.steps}
    <p class="recipe-step3__error">{errors.steps}</p>
  {/if}

  {#if formData.steps.length === 0}
    <p class="recipe-step3__message">Aucune étape ajoutée</p>
  {/if}

  <div class="recipe-step3__steps-container" bind:this={stepsContainer}>
    {#each formData.steps as step, index}
      <div class="recipe-step3__item">
        <div class="recipe-step3__header">
        <span class="recipe-step3__number">Étape {index + 1}</span>
        <div class="recipe-step3__actions">
          <button
            class="recipe-step3__action-btn"
            onclick={() => moveStepUp(index)}
            disabled={index === 0}
            type="button"
            title="Monter"
          >
            ↑
          </button>
          <button
            class="recipe-step3__action-btn"
            onclick={() => moveStepDown(index)}
            disabled={index === formData.steps.length - 1}
            type="button"
            title="Descendre"
          >
            ↓
          </button>
          <button
            class="recipe-step3__action-btn recipe-step3__action-btn--remove"
            onclick={() => removeStep(index)}
            type="button"
            title="Supprimer"
          >
            ✕
          </button>
        </div>
      </div>

      <Textarea
        id={`step-description-${index}`}
        value={step.description}
        oninput={(e) => updateStep(index, { description: e.currentTarget.value })}
        placeholder="Décrivez l'étape de préparation..."
        rows={3}
        error={errors[`step-${index}`]}
      />

      <Input
        id={`step-duration-${index}`}
        label="Durée (minutes, optionnel)"
        type="number"
        value={step.durationMinutes}
        oninput={(e) => updateStep(index, { durationMinutes: e.currentTarget.value })}
        min="0"
        placeholder="Ex: 10"
      />
    </div>
    {/each}
  </div>

  <Button
    variant="outlined-inverse"
    fullWidth
    onclick={addStep}
  >
    + Ajouter une étape
  </Button>
</div>

<style lang="scss">
  @use '../../styles/variables' as *;

  // Block: recipe-step3
  .recipe-step3 {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
    padding-bottom: $spacing-3xl;

    // Element: steps-container
    &__steps-container {
      display: flex;
      flex-direction: column;
      gap: $spacing-md;
    }

    // Element: error message
    &__error {
      color: $color-danger;
      font-size: 0.9rem;
      margin-top: $spacing-2xs;
    }

    // Element: message (no steps)
    &__message {
      text-align: center;
      color: $color-gray-600;
      padding: $spacing-lg;
    }

    // Element: item (individual step)
    &__item {
      padding: $spacing-sm;
      background: rgba($brand-primary, 0.05);
      border: 2px solid $color-gray-200;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      gap: $spacing-sm;
    }

    // Element: header
    &__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    // Element: number
    &__number {
      font-weight: 600;
      color: $brand-primary;
      font-size: 1.1rem;
    }

    // Element: actions container
    &__actions {
      display: flex;
      gap: $spacing-2xs;
    }

    // Element: action-btn
    &__action-btn {
      background: $color-white;
      border: 2px solid $color-gray-200;
      color: $color-gray-600;
      font-size: 1rem;
      cursor: pointer;
      padding: $spacing-2xs $spacing-2xs;
      border-radius: 6px;
      transition: all 0.2s;
      font-weight: 600;

      &:hover:not(:disabled) {
        border-color: $brand-primary;
        color: $brand-primary;
      }

      &:disabled {
        cursor: not-allowed;
        opacity: 0.3;
      }

      // Modifier: remove button
      &--remove {
        color: $color-danger;

        &:hover:not(:disabled) {
          border-color: $color-danger;
          background: $color-danger-alpha-10;
        }
      }
    }
  }
</style>
