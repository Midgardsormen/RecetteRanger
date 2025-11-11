<script lang="ts">
  import { onMount } from 'svelte';
  import { Title, Tile } from '../../../components/ui';
  import { apiService } from '../../../services/api.service';

  let { user }: { user: any } = $props();

  let lastRecipe = $state<any>(null);
  let todaysMeals = $state<any[]>([]);
  let uncheckedItems = $state<any[]>([]);
  let isLoading = $state(true);

  async function loadDashboardData() {
    try {
      isLoading = true;

      // Charger la dernière recette
      const recipesResponse = await apiService.searchRecipes({
        filter: 'mine',
        sortBy: 'popularity', // Tri par createdAt DESC
        limit: 1
      });
      if (recipesResponse.items && recipesResponse.items.length > 0) {
        lastRecipe = recipesResponse.items[0];
      }

      // Charger les repas du jour
      const today = new Date().toISOString().split('T')[0];
      console.log('🔍 Dashboard - Date du jour:', today);
      const mealDays = await apiService.getMealPlanDays({
        userId: user.id,
        fromDate: today,
        toDate: today
      });
      console.log('🔍 Dashboard - Réponse mealDays:', mealDays);
      if (mealDays && mealDays.length > 0) {
        todaysMeals = mealDays[0].items || [];
        console.log('🔍 Dashboard - Repas trouvés:', todaysMeals);
      } else {
        console.log('⚠️ Dashboard - Aucun meal day trouvé');
      }

      // Charger les listes de courses en cours avec items non cochés
      uncheckedItems = [];
      const lists = await apiService.getShoppingLists('IN_PROGRESS');
      if (lists && lists.length > 0) {
        // Récupérer tous les items non cochés de toutes les listes en cours
        for (const list of lists) {
          const fullList = await apiService.getShoppingList(list.id);
          const unchecked = fullList.items.filter((item: any) => !item.checked);
          uncheckedItems.push(...unchecked);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données du dashboard:', error);
    } finally {
      isLoading = false;
    }
  }

  onMount(() => {
    loadDashboardData();

    // Rafraîchir quand la fenêtre reprend le focus
    const handleFocus = () => {
      loadDashboardData();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  });
</script>

<div class="dashboard">
  <!-- Welcome Section -->
  <div class="dashboard__welcome">
    <Title level={1} align="center"><span>Bienvenue,</span> {user.pseudo} !</Title>
    <p class="dashboard__welcome-subtitle">Gérez vos recettes, planifiez vos repas et organisez vos courses en un seul endroit.</p>
  </div>

  {#if isLoading}
    <div class="dashboard__loading">Chargement...</div>
  {:else}
    <!-- Dashboard Tiles -->
    <div class="dashboard__grid">
      <!-- Dernière recette créée -->
      <div class="dashboard__tile">
        <h3 class="dashboard__tile-title">Dernière recette</h3>
        {#if lastRecipe}
          <a href="/recettes/{lastRecipe.id}" class="dashboard__tile-link">
            <Tile
              image={lastRecipe.imageUrl}
              title={lastRecipe.label}
              description={lastRecipe.description || 'Aucune description'}
            />
          </a>
        {:else}
          <p class="dashboard__tile-empty">Vous n'avez pas encore créé de recette</p>
        {/if}
      </div>

      <!-- Repas prévus aujourd'hui -->
      <div class="dashboard__tile">
        <h3 class="dashboard__tile-title">Au menu aujourd'hui</h3>
        {#if todaysMeals.length > 0}
          <div class="dashboard__meals">
            <ul class="dashboard__meals-list">
              {#each todaysMeals as meal}
                <li class="dashboard__meal-item">
                  {#if meal.recipe}
                    <a href="/recettes/{meal.recipe.id}" class="dashboard__meal-card">
                      <div class="dashboard__meal-image-wrapper">
                        {#if meal.recipe.imageUrl}
                          <img src={meal.recipe.imageUrl} alt={meal.recipe.label} class="dashboard__meal-image" />
                        {:else}
                          <div class="dashboard__meal-image-placeholder">
                            <span>🍽️</span>
                          </div>
                        {/if}
                        <span class="dashboard__meal-slot-badge">{meal.slot}</span>
                      </div>
                      <div class="dashboard__meal-content">
                        <h4 class="dashboard__meal-title">{meal.recipe.label}</h4>
                        {#if meal.recipe.description}
                          <p class="dashboard__meal-description">{meal.recipe.description}</p>
                        {/if}
                      </div>
                    </a>
                  {:else}
                    <div class="dashboard__meal-card dashboard__meal-card--no-recipe">
                      <div class="dashboard__meal-image-wrapper">
                        <div class="dashboard__meal-image-placeholder">
                          <span>📝</span>
                        </div>
                        <span class="dashboard__meal-slot-badge">{meal.slot}</span>
                      </div>
                      <div class="dashboard__meal-content">
                        <h4 class="dashboard__meal-title">{meal.note || 'Repas sans recette'}</h4>
                      </div>
                    </div>
                  {/if}
                </li>
              {/each}
            </ul>
          </div>
        {:else}
          <p class="dashboard__tile-empty">Aucun repas prévu pour aujourd'hui.<br/>Que diriez-vous de planifier quelque chose de bon ?</p>
        {/if}
      </div>

      <!-- Articles à acheter -->
      <div class="dashboard__tile">
        <h3 class="dashboard__tile-title">Courses en cours</h3>
        {#if uncheckedItems.length > 0}
          <div class="dashboard__shopping">
            <p class="dashboard__shopping-intro">Il vous reste {uncheckedItems.length} article{uncheckedItems.length > 1 ? 's' : ''} à acheter :</p>
            <ul class="dashboard__shopping-list">
              {#each uncheckedItems.slice(0, 5) as item}
                <li class="dashboard__shopping-item">
                  <span class="dashboard__shopping-label">{item.label}</span>
                  {#if item.quantity}
                    <span class="dashboard__shopping-quantity">{item.quantity} {item.unit || ''}</span>
                  {/if}
                </li>
              {/each}
              {#if uncheckedItems.length > 5}
                <li class="dashboard__shopping-more">+ {uncheckedItems.length - 5} autre{uncheckedItems.length - 5 > 1 ? 's' : ''}</li>
              {/if}
            </ul>
            <a href="/shopping-lists" class="dashboard__tile-action">Voir mes listes →</a>
          </div>
        {:else}
          <p class="dashboard__tile-empty">Aucune liste de courses en cours.<br/>Tout est fait ou c'est le moment d'en créer une !</p>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style lang="scss">
  @import '../../../styles/variables';

  // Block: dashboard
  .dashboard {
    display: flex;
    flex-direction: column;
    gap: $spacing-2xl;

    // Element: loading
    &__loading {
      text-align: center;
      padding: $spacing-2xl;
      color: $color-text-secondary;
      font-size: $font-size-lg;
    }

    // Element: welcome
    &__welcome {
      @include retro-grain(0.3);
      background: $brand-quaternary;
      background-image: url('/assets/images/ChatGPT Image 11 nov. 2025, 00_10_06.png');
      background-size: cover;
      background-position: center;
      background-blend-mode: overlay;
      position: relative;
      color: $color-white;
      padding: $spacing-lg $spacing-sm;
      border-radius: $radius-2xl;
      text-align: center;
      box-shadow: 0 4px 20px rgba($brand-primary, 0.3);
      @media (min-width: $breakpoint-md) {
        padding:  $spacing-3xl $spacing-md $spacing-2xl;
      }
      @media (min-width: $breakpoint-lg) {
        padding:  $spacing-4xl $spacing-lg $spacing-2xl;
      }
      // Overlay pour contrôler l'opacité de l'image
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: $brand-quaternary;
        opacity: 0.85;
        border-radius: $radius-2xl;
        z-index: 0;
      }

      // S'assurer que le contenu est au-dessus de l'overlay
      > * {
        position: relative;
        z-index: 1;
      }

      :global {
        .title {
          text-transform: uppercase;
          font-family: $font-family-heading;
          font-weight: $font-weight-bold;
          color: $color-decorative-title;
          text-shadow: $shadow-decorative-title;
          opacity: 0.9;
          display: flex;
          flex-direction: column;
          line-height: 1;
          margin-bottom: $spacing-lg;
          span{
            font-size: $font-size-2xl;
          }
        }
      }
    }

    // Element: welcome-subtitle
    &__welcome-subtitle {
      font-size: $font-size-xl;
      opacity: $opacity-90;
      margin: 0;

      @media (max-width: $breakpoint-md) {
        font-size: $font-size-base;
      }
    }

    // Element: grid
    &__grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: $spacing-lg;

      @media (min-width: $breakpoint-md) {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    // Element: tile
    &__tile {
      background: $color-white;
      border-radius: $radius-xl;
      padding: $spacing-lg;
      box-shadow: $shadow-md;
    }

    &__tile-title {
      text-transform: uppercase;
      font-family: $font-family-heading;
      font-size: $title-size-3;
      font-weight: $font-weight-bold;
      color: $brand-primary;
      margin: 0 0 $spacing-base 0;
      text-align: center;
    }

    &__tile-link {
      text-decoration: none;
      color: inherit;
      display: block;

      &:hover {
        opacity: 0.9;
      }
    }

    &__tile-empty {
      color: $color-text-secondary;
      font-style: italic;
      margin: $spacing-base 0;
      text-align: center;
      padding: $spacing-lg;
    }

    &__tile-action {
      display: inline-block;
      margin-top: $spacing-base;
      color: $brand-primary;
      font-weight: $font-weight-semibold;
      text-decoration: none;
      transition: color $transition-fast $transition-ease;

      &:hover {
        color: $brand-secondary;
      }
    }

    // Element: meals
    &__meals-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: $spacing-base;
    }

    &__meal-item {
      display: block;
    }

    &__meal-card {
      display: flex;
      gap: $spacing-base;
      background: $color-background-secondary;
      border-radius: $radius-lg;
      overflow: hidden;
      border: 2px solid $color-border-primary;
      transition: all $transition-base $transition-ease;
      text-decoration: none;
      color: inherit;

      &:hover {
        border-color: $brand-primary;
        box-shadow: 0 4px 12px rgba($brand-primary, 0.15);
        transform: translateY(-2px);
      }

      &--no-recipe {
        pointer-events: none;
        opacity: 0.8;
      }
    }

    &__meal-image-wrapper {
      position: relative;
      width: 120px;
      height: 100px;
      flex-shrink: 0;
      overflow: hidden;
      background: linear-gradient(135deg, $brand-tertiary 0%, $brand-primary 100%);
    }

    &__meal-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    &__meal-image-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
      background: linear-gradient(135deg, $brand-tertiary 0%, $brand-primary 100%);
    }

    &__meal-slot-badge {
      position: absolute;
      top: $spacing-xs;
      left: $spacing-xs;
      background: rgba($color-white, 0.95);
      color: $brand-primary;
      padding: $spacing-xs $spacing-xs;
      border-radius: $radius-sm;
      font-size: $font-size-xs;
      font-weight: $font-weight-bold;
      text-transform: uppercase;
      box-shadow: $shadow-sm;
    }

    &__meal-content {
      flex: 1;
      padding: $spacing-sm $spacing-base $spacing-sm 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      min-width: 0;
    }

    &__meal-title {
      margin: 0 0 $spacing-xs 0;
      font-size: $font-size-base;
      font-weight: $font-weight-semibold;
      color: $color-text-primary;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &__meal-description {
      margin: 0;
      font-size: $font-size-sm;
      color: $color-text-secondary;
      line-height: 1.4;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    // Element: shopping
    &__shopping-intro {
      margin: 0 0 $spacing-base 0;
      color: $color-text-secondary;
    }

    &__shopping-list {
      list-style: none;
      padding: 0;
      margin: 0 0 $spacing-base 0;
    }

    &__shopping-item {
      padding: $spacing-sm 0;
      border-bottom: 1px solid $color-border-primary;
      display: flex;
      justify-content: space-between;
      align-items: center;

      &:last-child {
        border-bottom: none;
      }
    }

    &__shopping-label {
      color: $color-text-primary;
      font-weight: $font-weight-medium;
    }

    &__shopping-quantity {
      color: $color-text-secondary;
      font-size: $font-size-sm;
    }

    &__shopping-more {
      padding: $spacing-sm 0;
      color: $color-text-secondary;
      font-style: italic;
      text-align: center;
    }
  }
</style>
