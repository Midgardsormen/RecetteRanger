<script lang="ts">
  import Layout from '../../layouts/Layout.svelte';
  import { IconButton, Tag, Hero, StepItem, Breadcrumb, AuthorLink, Link } from '../../components/ui';
  import { Users, Clock, Utensils, ChefHat, Carrot, Zap, ExternalLink } from 'lucide-svelte';
  import type { Recipe } from '../../types/recipe.types';
  import { RecipeCategoryLabels, RecipeDifficultyLabels } from '../../types/recipe.types';
  import { UnitLabels } from '../../types/ingredient.types';

  // Recevoir les données du SSR
  let { recipe, user = null }: { recipe: Recipe, user?: any } = $props();

  // Debug
  console.log('Recipe sourceUrl:', recipe?.sourceUrl);

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

      <Breadcrumb
        mode="simple"
        backLabel="Retour"
        onBack={goBack}
      />

      <Hero
        variant="grid"
        backgroundImage="/assets/images/ChatGPT Image 11 nov. 2025, 00_10_06.png"
        backgroundColor="var(--brand-quaternary)"
        overlay={true}
        overlayOpacity={0.85}
      >
        {#if recipe.imageUrl}
          <img src={recipe.imageUrl} alt={recipe.label} class="recipe-image" />
        {:else}
          <div class="recipe-image-placeholder">
            <Utensils size={80} />
          </div>
        {/if}

        <div class="recipe-title-section">
          <h1>{recipe.label}</h1>

          <div class="recipe-meta-tags">
            <div class="recipe-tags">
              <Tag variant="primary-inverse" size="small">
                {RecipeCategoryLabels[recipe.category] || 'Non catégorisé'}
              </Tag>
              <Tag variant="info-inverse" size="small">
                {RecipeDifficultyLabels[recipe.difficulty]}
              </Tag>
            </div>

            {#if recipe.owner}
              <div class="recipe-author">
                <AuthorLink
                  authorId={recipe.owner.id}
                  authorPseudo={recipe.owner.pseudo}
                  authorAvatar={recipe.owner.avatarUrl}
                  size="medium"
                />
              </div>
            {/if}
          </div>

          <div class="recipe-meta">
            <div class="recipe-meta-left">
              <div class="meta-item servings-control">
                <Users class="meta-icon" size={20} />
                <IconButton onclick={decrementServings} disabled={servings <= 1} size="small" variant="ghost-inverse">−</IconButton>
                <span class="servings-value">{servings} {servings > 1 ? 'personnes' : 'personne'}</span>
                <IconButton onclick={incrementServings} size="small" variant="ghost-inverse">+</IconButton>
              </div>
              <div class="meta-item">
                <Clock class="meta-icon" size={20} />
                <span>{formatTime(getTotalTime())}</span>
              </div>
            </div>
            {#if recipe.sourceUrl}
              <div class="recipe-meta-right">
                <Link href={recipe.sourceUrl} variant="inverse" target="_blank" rel="noopener noreferrer">
                  Recette originale
                  <ExternalLink size={16} />
                </Link>
              </div>
            {/if}
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
      </Hero>

    <!-- Section Matériel et Appareils -->
    {#if (recipe.materiel && recipe.materiel.length > 0) || (recipe.appareils && recipe.appareils.length > 0)}
      <div class="equipment-section">
        {#if recipe.materiel && recipe.materiel.length > 0}
          <div class="equipment-card">
            <h3><Utensils size={20} style="display: inline-block; vertical-align: middle; margin-right: 8px;" /> Matériel</h3>
            <ul class="equipment-list">
              {#each recipe.materiel as item}
                <li class="equipment-item">{item}</li>
              {/each}
            </ul>
          </div>
        {/if}

        {#if recipe.appareils && recipe.appareils.length > 0}
          <div class="equipment-card">
            <h3><Zap size={20} style="display: inline-block; vertical-align: middle; margin-right: 8px;" /> Appareils</h3>
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
        <h2><Carrot size={24} style="display: inline-block; vertical-align: middle; margin-right: 8px;" /> Ingrédients</h2>
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
        <h2><ChefHat size={24} style="display: inline-block; vertical-align: middle; margin-right: 8px;" /> Préparation</h2>
        {#if recipe.steps && recipe.steps.length > 0}
          <div class="steps-list">
            {#each recipe.steps as step}
              <StepItem
                stepNumber={step.stepNumber}
                description={step.description}
                duration={step.durationMinutes && step.durationMinutes > 0 ? formatTime(step.durationMinutes) : undefined}
                badgeColor="quaternary"
                badgeSize="medium"
                badgeVariant="filled"
                badgeShape="circle"
              />
            {/each}
          </div>
        {:else}
          <p class="empty-message">Aucune étape définie</p>
        {/if}
      </div>
    </div>
  {/if}
</div>
</Layout>

<style lang="scss">
   @use '../../styles/variables' as *;
  .recipe-detail {
    display: flex;
    flex-direction: column;
    gap: $spacing-lg;
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

    :global(svg) {
      opacity: 0.5;
      color: $color-white;
    }
  }

  .recipe-title-section {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    color: $color-white;
  }

  .recipe-meta-tags {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: $spacing-base;
  }

  .recipe-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .recipe-author {
    :global(.author-link__pseudo) {
      color: $color-white !important;
      text-decoration: underline;
    }

    :global(.author-link__avatar-placeholder) {
      background: rgba($color-white, 0.25);
      color: $color-white;
    }

    :global(.author-link--clickable:hover .author-link__pseudo) {
      color: $brand-cream !important;
      text-decoration: none !important;
    }

    :global(.author-link--clickable:hover .author-link__avatar-placeholder) {
      background: rgba($color-white, 0.4);
    }
  }

  h1 {
    font-size: 2rem;
    margin: 0;
    line-height: 1.3;
    text-transform: uppercase;
    font-family: $font-family-heading;
    font-weight: $font-weight-bold;
    color: $color-decorative-title;
    text-shadow: $shadow-decorative-title;
  }

  .recipe-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 2rem;
    flex-wrap: wrap;
    margin-top: 0.5rem;
    color: $color-white;
  }

  .recipe-meta-left {
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;
  }

  .recipe-meta-right {
    :global(.link) {
      display: inline-flex;
      align-items: center;
      gap: $spacing-xs;
      text-transform: none !important;
      text-shadow: none !important;

      :global(svg) {
        flex-shrink: 0;
      }
    }
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 1.1rem;
    font-weight: 500;
    color: $color-white;
  }

  :global(.meta-icon) {
    flex-shrink: 0;
  }

  .servings-control {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    :global(button) {
      color: $color-white !important;

      &:hover:not(:disabled) {
        background: rgba($color-white, 0.2) !important;
      }
    }
  }


  .servings-value {
    min-width: 100px;
    text-align: center;
    font-weight: 600;
    color: $color-white;
  }

  .time-breakdown {
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;
    margin-top: 0.5rem;
  }

  .time-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .time-label {
    font-size: 0.85rem;
    color: rgba($color-white, 0.85);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .time-value {
    font-size: 1.1rem;
    font-weight: 600;
    color: $color-white;
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
    box-shadow: 0 2px 8px $color-black-alpha-06;

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
    box-shadow: 0 2px 12px $color-black-alpha-08;
  }

  .ingredients-section,
  .steps-section {
    background: $color-white;
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
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .empty-message {
    color: var(--text-secondary);
    font-style: italic;
    text-align: center;
    padding: 2rem;
  }
</style>
