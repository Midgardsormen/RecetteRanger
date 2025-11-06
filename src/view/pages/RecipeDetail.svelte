<script lang="ts">
  import Layout from '../layouts/Layout.svelte';
  import { Button } from '../components/ui';
  import type { Recipe } from '../types/recipe.types';
  import { UnitLabels } from '../types/ingredient.types';

  // Recevoir les données du SSR
  let { recipe, user = null }: { recipe: Recipe, user?: any } = $props();

  // Nombre de personnes (par défaut 4)
  let servings = $state(4);

  // Calculer le multiplicateur de quantités
  let multiplier = $derived(servings / (recipe.servings || 1));

  function formatTime(minutes: number): string {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h${mins}` : `${hours}h`;
  }

  function getTotalTime(): number {
    if (!recipe) return 0;
    return recipe.prepMinutes + recipe.cookMinutes + recipe.restMinutes;
  }

  function goBack() {
    window.location.href = '/recettes';
  }

  function adjustQuantity(quantity: number | null, scalable: boolean): string {
    if (!quantity) return '';

    // Si l'ingrédient n'est pas scalable, retourner la quantité d'origine
    if (!scalable) {
      return quantity.toString();
    }

    // Sinon, multiplication normale
    const adjusted = quantity * multiplier;
    return adjusted % 1 === 0 ? adjusted.toString() : adjusted.toFixed(1);
  }

  function incrementServings() {
    servings++;
  }

  function decrementServings() {
    if (servings > 1) {
      servings--;
    }
  }
</script>

<Layout title={recipe.label} currentPage="/recettes" {user}>
<div class="recipe-detail">
  {#if recipe}
    <div class="recipe-header">
      <Button variant="secondary" onclick={goBack}>
        ← Retour
      </Button>

      <div class="recipe-hero">
        {#if recipe.imageUrl}
          <img src={recipe.imageUrl} alt={recipe.label} class="recipe-image" />
        {:else}
          <div class="recipe-image-placeholder">
            <span>🍽️</span>
          </div>
        {/if}

        <div class="recipe-title-section">
          <h1>{recipe.label}</h1>

          <div class="recipe-meta">
            <div class="meta-item servings-control">
              <span class="meta-icon">👥</span>
              <button class="servings-btn" onclick={decrementServings} disabled={servings <= 1}>−</button>
              <span class="servings-value">{servings} {servings > 1 ? 'personnes' : 'personne'}</span>
              <button class="servings-btn" onclick={incrementServings}>+</button>
            </div>
            <div class="meta-item">
              <span class="meta-icon">⏱️</span>
              <span>{formatTime(getTotalTime())}</span>
            </div>
          </div>

          <div class="time-breakdown">
            {#if recipe.prepMinutes > 0}
              <div class="time-item">
                <span class="time-label">Préparation</span>
                <span class="time-value">{formatTime(recipe.prepMinutes)}</span>
              </div>
            {/if}
            {#if recipe.cookMinutes > 0}
              <div class="time-item">
                <span class="time-label">Cuisson</span>
                <span class="time-value">{formatTime(recipe.cookMinutes)}</span>
              </div>
            {/if}
            {#if recipe.restMinutes > 0}
              <div class="time-item">
                <span class="time-label">Repos</span>
                <span class="time-value">{formatTime(recipe.restMinutes)}</span>
              </div>
            {/if}
          </div>
        </div>
      </div>
    </div>

    <!-- Section Matériel et Appareils -->
    {#if (recipe.materiel && recipe.materiel.length > 0) || (recipe.appareils && recipe.appareils.length > 0)}
      <div class="equipment-section">
        {#if recipe.materiel && recipe.materiel.length > 0}
          <div class="equipment-card">
            <h3>🔪 Matériel</h3>
            <ul class="equipment-list">
              {#each recipe.materiel as item}
                <li class="equipment-item">{item}</li>
              {/each}
            </ul>
          </div>
        {/if}

        {#if recipe.appareils && recipe.appareils.length > 0}
          <div class="equipment-card">
            <h3>⚡ Appareils</h3>
            <ul class="equipment-list">
              {#each recipe.appareils as item}
                <li class="equipment-item">{item}</li>
              {/each}
            </ul>
          </div>
        {/if}
      </div>
    {/if}

    <div class="recipe-content">
      <!-- Section Ingrédients -->
      <div class="section ingredients-section">
        <h2>🥕 Ingrédients</h2>
        {#if recipe.ingredients && recipe.ingredients.length > 0}
          <ul class="ingredients-list">
            {#each recipe.ingredients as item}
              <li class="ingredient-item">
                <span class="ingredient-checkbox">
                  <input type="checkbox" id="ingredient-{item.id}" />
                  <label for="ingredient-{item.id}"></label>
                </span>
                <span class="ingredient-content">
                  {#if item.quantity}
                    <strong>{adjustQuantity(item.quantity, item.scalable)} {item.unit ? UnitLabels[item.unit] || item.unit : ''}</strong>
                  {/if}
                  <span class="ingredient-name">{item.ingredient?.label || 'Ingrédient'}</span>
                  {#if item.note}
                    <span class="ingredient-note">({item.note})</span>
                  {/if}
                </span>
              </li>
            {/each}
          </ul>
        {:else}
          <p class="empty-message">Aucun ingrédient défini</p>
        {/if}
      </div>

      <!-- Section Étapes -->
      <div class="section steps-section">
        <h2>👨‍🍳 Préparation</h2>
        {#if recipe.steps && recipe.steps.length > 0}
          <ol class="steps-list">
            {#each recipe.steps as step}
              <li class="step-item">
                <div class="step-number">{step.stepNumber}</div>
                <div class="step-content">
                  <p class="step-description">{step.description}</p>
                  {#if step.durationMinutes && step.durationMinutes > 0}
                    <div class="step-duration">
                      <span class="duration-icon">⏱️</span>
                      <span>{formatTime(step.durationMinutes)}</span>
                    </div>
                  {/if}
                </div>
              </li>
            {/each}
          </ol>
        {:else}
          <p class="empty-message">Aucune étape définie</p>
        {/if}
      </div>
    </div>
  {/if}
</div>
</Layout>

<style lang="scss">
  .recipe-detail {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  .loading,
  .error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    text-align: center;
    gap: 1.5rem;
  }

  .spinner {
    width: 48px;
    height: 48px;
    border: 4px solid var(--border-color);
    border-top-color: var(--primary-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .error-icon {
    font-size: 4rem;
  }

  .recipe-header {
    margin-bottom: 2.5rem;
  }

  .back-button {
    margin-bottom: 1.5rem;
  }

  .recipe-hero {
    display: grid;
    grid-template-columns: 1fr 1.5fr;
    gap: 2.5rem;
    background: var(--surface-color);
    border-radius: 16px;
    padding: 2.5rem;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      padding: 1.5rem;
    }
  }

  .recipe-image {
    width: 100%;
    height: 300px;
    object-fit: cover;
    border-radius: 12px;
  }

  .recipe-image-placeholder {
    width: 100%;
    height: 300px;
    background: var(--background-color);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 5rem;
  }

  .recipe-title-section {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  h1 {
    font-size: 2rem;
    margin: 0;
    color: var(--text-color);
    line-height: 1.3;
  }

  .recipe-meta {
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;
    margin-top: 0.5rem;
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 1.1rem;
    font-weight: 500;
  }

  .meta-icon {
    font-size: 1.5rem;
  }

  .servings-control {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: var(--background-color);
    border-radius: 12px;
  }

  .servings-btn {
    width: 32px;
    height: 32px;
    border: 2px solid var(--primary-color);
    background: var(--surface-color);
    color: var(--primary-color);
    border-radius: 8px;
    font-size: 1.2rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover:not(:disabled) {
      background: var(--primary-color);
      color: white;
      transform: scale(1.05);
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    &:active:not(:disabled) {
      transform: scale(0.95);
    }
  }

  .servings-value {
    min-width: 100px;
    text-align: center;
    font-weight: 600;
    color: var(--text-color);
  }

  .time-breakdown {
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;
    padding: 1.5rem;
    background: var(--background-color);
    border-radius: 12px;
    margin-top: 0.5rem;
  }

  .time-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .time-label {
    font-size: 0.85rem;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .time-value {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--primary-color);
  }

  .equipment-section {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    margin-top: 2.5rem;
  }

  .equipment-card {
    background: var(--surface-color);
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

    h3 {
      font-size: 1.2rem;
      margin: 0 0 1rem 0;
      color: var(--text-color);
      font-weight: 600;
    }
  }

  .equipment-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .equipment-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    background: var(--background-color);
    border-radius: 8px;
    color: var(--text-color);
    font-size: 0.95rem;

    &::before {
      content: '•';
      color: var(--primary-color);
      font-weight: bold;
      font-size: 1.2rem;
    }
  }

  .recipe-content {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 2.5rem;
    margin-top: 2.5rem;

    @media (max-width: 968px) {
      grid-template-columns: 1fr;
    }
  }

  .section {
    background: var(--surface-color);
    border-radius: 16px;
    padding: 2rem;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  }

  h2 {
    font-size: 1.5rem;
    margin: 0 0 1.5rem 0;
    color: var(--text-color);
    font-weight: 600;
  }

  .ingredients-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .ingredient-item {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 1rem;
    border-radius: 8px;
    transition: background-color 0.2s;

    &:hover {
      background: var(--background-color);
    }
  }

  .ingredient-checkbox {
    display: flex;
    align-items: center;
    margin-top: 2px;

    input[type="checkbox"] {
      width: 20px;
      height: 20px;
      cursor: pointer;
      accent-color: var(--primary-color);
    }
  }

  .ingredient-content {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    align-items: baseline;
    line-height: 1.6;
  }

  .ingredient-name {
    color: var(--text-color);
  }

  .ingredient-note {
    color: var(--text-secondary);
    font-style: italic;
    font-size: 0.9rem;
  }

  .steps-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    counter-reset: step-counter;
  }

  .step-item {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 1.25rem;
    padding: 1.5rem;
    border-radius: 12px;
    background: var(--background-color);
  }

  .step-number {
    width: 36px;
    height: 36px;
    background: var(--primary-color);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    flex-shrink: 0;
  }

  .step-content {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .step-description {
    margin: 0;
    line-height: 1.6;
    color: var(--text-color);
    font-size: 1rem;
  }

  .step-duration {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--primary-color);
    font-weight: 500;
    font-size: 0.9rem;
    margin-top: 0.25rem;
  }

  .duration-icon {
    font-size: 1rem;
  }

  .empty-message {
    color: var(--text-secondary);
    font-style: italic;
    text-align: center;
    padding: 2rem;
  }
</style>
