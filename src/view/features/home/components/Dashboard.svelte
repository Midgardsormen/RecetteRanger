<script lang="ts">
  import { onMount } from 'svelte';
  import { Title, Link, Loader, ProgressBar, Hero } from '../../../components/ui';
  import { apiService } from '../../../services/api.service';
  import DashboardTile from './DashboardTile/DashboardTile.svelte';

  let { user }: { user: any } = $props();

  let lastRecipes = $state<any[]>([]);
  let todaysMeals = $state<any[]>([]);
  let uncheckedItems = $state<any[]>([]);
  let shoppingLists = $state<any[]>([]);
  let isLoading = $state(true);

  async function loadDashboardData() {
    try {
      isLoading = true;

      // Charger les 3 dernières recettes
      const recipesResponse = await apiService.searchRecipes({
        filter: 'mine',
        sortBy: 'createdAt',
        limit: 3
      });
      if (recipesResponse.items && recipesResponse.items.length > 0) {
        lastRecipes = recipesResponse.items;
      }

      // Charger les repas du jour
      const today = new Date().toISOString().split('T')[0];

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
      shoppingLists = [];
      const lists = await apiService.getShoppingLists('IN_PROGRESS');
      console.log('🔍 Dashboard - Listes IN_PROGRESS:', lists);
      if (lists && lists.length > 0) {
        // Récupérer toutes les listes complètes avec leurs items
        for (const list of lists) {
          const fullList = await apiService.getShoppingList(list.id);
          shoppingLists.push(fullList);
          const unchecked = fullList.items.filter((item: any) => !item.checked);
          uncheckedItems.push(...unchecked);
        }
      }
      console.log('🔍 Dashboard - Items non cochés:', uncheckedItems.length);
    } catch (error) {
      console.error('Erreur lors du chargement des données du dashboard:', error);
    } finally {
      isLoading = false;
    }
  }

  onMount(() => {
    loadDashboardData();
  });
</script>

<div class="dashboard">
  <!-- Welcome Section -->
  <Hero
    variant="compact"
    backgroundImage="/assets/images/ChatGPT Image 11 nov. 2025, 00_10_06.png"
    backgroundColor="var(--brand-quaternary)"
    overlay={true}
    overlayOpacity={0.85}
    textAlign="center"
  >
    <Title level={1} align="center"><span>Bienvenue,</span> {user.pseudo} !</Title>
    <p class="dashboard__welcome-subtitle">Gérez vos recettes, planifiez vos repas et organisez vos courses en un seul endroit.</p>
  </Hero>

  {#if isLoading}
    <Loader size="large" message="Chargement de votre tableau de bord..." />
  {:else}
    <!-- Dashboard Tiles -->
    <div class="dashboard__grid">
      <!-- Dernières recettes créées -->
      <DashboardTile title="Dernières recettes" backgroundImage="/assets/images/52122fb2-7c16-43c4-ab68-d3669ef31c0e.png">
        {#if lastRecipes.length > 0}
          <ul class="dashboard__recipes-compact">
            {#each lastRecipes as recipe}
              <li class="dashboard__recipe-compact-item">
                <a href="/recettes/{recipe.id}" class="dashboard__recipe-compact-link">
                  <div class="dashboard__recipe-compact-image">
                    {#if recipe.imageUrl}
                      <img src={recipe.imageUrl} alt={recipe.label} />
                    {:else}
                      <span class="dashboard__recipe-compact-placeholder">🍽️</span>
                    {/if}
                  </div>
                  <div class="dashboard__recipe-compact-content">
                    {#if recipe.category}
                      <span class="dashboard__recipe-compact-category">{recipe.category}</span>
                    {/if}
                    <span class="dashboard__recipe-compact-title">{recipe.label}</span>
                  </div>
                </a>
              </li>
            {/each}
          </ul>
          <Link href="/recettes" variant="inverse">
            Voir toutes mes recettes →
          </Link>
        {:else}
          <p class="dashboard__tile-empty-text">Vous n'avez pas encore créé de recette</p>
        {/if}
      </DashboardTile>

      <!-- Repas prévus aujourd'hui -->
      <DashboardTile title="Au menu aujourd'hui" backgroundImage="/assets/images/a8800c87-1ca0-4225-ab1e-adcb646fbf18.png">
        {#if todaysMeals.length > 0}
          <ul class="dashboard__meals-compact">
            {#each todaysMeals as meal}
              <li class="dashboard__meal-compact-item">
                {#if meal.recipe}
                  <a href="/recettes/{meal.recipe.id}" class="dashboard__meal-compact-link">
                    <div class="dashboard__meal-compact-image">
                      {#if meal.recipe.imageUrl}
                        <img src={meal.recipe.imageUrl} alt={meal.recipe.label} />
                      {:else}
                        <span class="dashboard__meal-compact-placeholder">🍽️</span>
                      {/if}
                    </div>
                    <div class="dashboard__meal-compact-content">
                      <span class="dashboard__meal-compact-slot">{meal.slot}</span>
                      <span class="dashboard__meal-compact-title">{meal.recipe.label}</span>
                    </div>
                  </a>
                {:else}
                  <div class="dashboard__meal-compact-link dashboard__meal-compact-link--no-recipe">
                    <div class="dashboard__meal-compact-image">
                      <span class="dashboard__meal-compact-placeholder">📝</span>
                    </div>
                    <div class="dashboard__meal-compact-content">
                      <span class="dashboard__meal-compact-slot">{meal.slot}</span>
                      <span class="dashboard__meal-compact-title">{meal.note || 'Repas sans recette'}</span>
                    </div>
                  </div>
                {/if}
              </li>
            {/each}
          </ul>
        {:else}
          <p class="dashboard__tile-empty-text">Aucun repas prévu pour aujourd'hui.<br/>Que diriez-vous de planifier quelque chose de bon ?</p>
        {/if}
        <Link href="/plannings" variant="inverse">Voir les plannings →</Link>
      </DashboardTile>

      <!-- Articles à acheter -->
      <DashboardTile title="Courses en cours" backgroundImage="/assets/images/375f5d6f-4fd3-4293-8af7-84e87db0b4e7.png">
        {#if shoppingLists.length > 0}
          <div class="dashboard__shopping-compact">
            {#each shoppingLists as list}
              {@const totalItems = list.items.length}
              {@const checkedItems = list.items.filter((item) => item.checked).length}
              {@const progress = totalItems > 0 ? (checkedItems / totalItems) * 100 : 0}

              <a href="/shopping-lists/{list.id}" class="dashboard__shopping-list-card">
                <p class="dashboard__shopping-list-name">{list.name}</p>
                <div class="dashboard__shopping-list-stats">
                  <p class="dashboard__shopping-list-count">{checkedItems} article{checkedItems > 1 ? 's' : ''} acheté{checkedItems > 1 ? 's' : ''} sur {totalItems}</p>
                  <ProgressBar value={checkedItems} max={totalItems} size="small" variant="success" />
                </div>
              </a>
            {/each}
            <Link href="/shopping-lists" variant="inverse">
              Voir toutes mes listes →
            </Link>
          </div>
        {:else}
          <p class="dashboard__tile-empty-text">Aucune liste de courses en cours.<br/>Tout est fait ou c'est le moment d'en créer une !</p>
        {/if}
      </DashboardTile>
    </div>
  {/if}
</div>

<style lang="scss">
  @use '../../../styles/variables' as *;

  // Block: dashboard
  .dashboard {
    display: flex;
    flex-direction: column;

    // Ajouter du padding-top au Hero pour que le logo chevauche
    :global(.hero--compact) {
      // Mobile: logo home = 110px, on veut qu'il chevauche
      padding-top: 50px;

      // Small mobile: logo home = 120px
      @media (min-width: $breakpoint-sm) {
        padding-top: 55px;
      }

      // Tablet: logo home = 150px
      @media (min-width: $breakpoint-md) {
        padding-top: 90px;
      }

      // Desktop: logo home = 180px
      @media (min-width: $breakpoint-lg) {
        padding-top: 50px;
      }
    }

    // Styles globaux pour le titre dans le Hero
    :global {
      .hero .title {
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

    &__tile-empty-text {
      color: $color-text-inverse;
      font-weight: $font-weight-bold;
      text-shadow: $text-shadow-sharp-md;
      font-size: $font-size-base;
      margin: $spacing-base 0;
      text-align: center;
      padding: $spacing-lg;
      line-height: $line-height-tight;
    }


    // Element: recipes-compact (nouvelle version)
    &__recipes-compact {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: $spacing-base;
      width: 100%;
    }

    &__recipe-compact-item {
      display: block;
    }

    &__recipe-compact-link {
      display: flex;
      align-items: center;
      gap: $spacing-base;
      padding: $spacing-sm;
      background: $brand-cream;
      border-radius: $radius-lg;
      text-decoration: none;
      color: inherit;
      transition: all $transition-base;
      position: relative;
      overflow: hidden;

      // Effet grain rétro
      &::before {
        @include retro-grain(0.2);
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
      }

      &:hover {
        transform: translateY(-2px);
        box-shadow: $shadow-lg;
      }
    }

    &__recipe-compact-image {
      @include retro-grain(0.3);
      width: 80px;
      height: 80px;
      flex-shrink: 0;
      border-radius: $radius-md;
      overflow: hidden;
      background: $brand-cream;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
    }

    &__recipe-compact-placeholder {
      font-size: 2.5rem;
    }

    &__recipe-compact-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: $spacing-xs;
      min-width: 0;
      text-align: left;
    }

    &__recipe-compact-category {
      display: inline-block;
      width: auto;
      font-family: $font-family-heading;
      font-size: $font-size-xs;
      font-weight: $font-weight-bold;
      text-transform: uppercase;
      color: $color-text-inverse;
      background: $brand-primary;
      padding: $spacing-xs $spacing-sm;
      border-radius: $radius-sm;
      letter-spacing: 0.5px;
      text-shadow: $text-shadow-sharp-sm;
      box-shadow: $shadow-sm;
      align-self: flex-start;
    }

    &__recipe-compact-title {
      font-size: $font-size-base;
      font-weight: $font-weight-semibold;
      color: $color-text-primary;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    // Element: meals-compact (nouvelle version)
    &__meals-compact {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: $spacing-base;
      width: 100%;
    }

    &__meal-compact-item {
      display: block;
    }

    &__meal-compact-link {
      display: flex;
      align-items: center;
      gap: $spacing-base;
      padding: $spacing-sm;
      background: $brand-cream;
      border-radius: $radius-lg;
      text-decoration: none;
      color: inherit;
      transition: all $transition-base;
      position: relative;
      overflow: hidden;

      // Effet grain rétro
      &::before {
        @include retro-grain(0.2);
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
      }

      &:hover {
        transform: translateY(-2px);
        box-shadow: $shadow-lg;
      }

      &--no-recipe {
        pointer-events: none;
        opacity: 0.8;
      }
    }

    &__meal-compact-image {
      @include retro-grain(0.3);
      width: 80px;
      height: 80px;
      flex-shrink: 0;
      border-radius: $radius-md;
      overflow: hidden;
      background: $brand-cream;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
    }

    &__meal-compact-placeholder {
      font-size: 2.5rem;
    }

    &__meal-compact-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: $spacing-xs;
      min-width: 0;
      text-align: left;
    }

    &__meal-compact-slot {
      display: inline-block;
      width: auto;
      font-family: $font-family-heading;
      font-size: $font-size-xs;
      font-weight: $font-weight-bold;
      text-transform: uppercase;
      color: $color-text-inverse;
      background: $brand-primary;
      padding: $spacing-xs $spacing-sm;
      border-radius: $radius-sm;
      letter-spacing: 0.5px;
      text-shadow: $text-shadow-sharp-sm;
      box-shadow: $shadow-sm;
      align-self: flex-start;
    }

    &__meal-compact-title {
      font-size: $font-size-base;
      font-weight: $font-weight-semibold;
      color: $color-text-primary;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    // Element: shopping-compact (nouvelle version)
    &__shopping-compact {
      display: flex;
      flex-direction: column;
      gap: $spacing-base;
      width: 100%;
    }

    &__shopping-list-card {
      @include retro-grain(0.2);
      display: flex;
      flex-direction: column;
      gap: $spacing-xs;
      background: $brand-cream;
      padding: $spacing-base;
      border-radius: $radius-lg;
      text-decoration: none;
      transition: all $transition-base;
      position: relative;
      overflow: hidden;

      &::before {
        @include retro-grain(0.2);
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
      }

      &:hover {
        transform: translateY(-2px);
        box-shadow: $shadow-lg;
      }
    }

    &__shopping-list-name {
      margin: 0 0 $spacing-xs 0;
      font-size: $font-size-base;
      font-weight: $font-weight-bold;
      color: $color-text-primary;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      position: relative;
      z-index: 1;
    }

    &__shopping-list-stats {
      display: flex;
      flex-direction: column;
      gap: $spacing-xs;
      position: relative;
      z-index: 1;
    }

    &__shopping-list-count {
      margin: 0;
      font-size: $font-size-sm;
      font-weight: $font-weight-semibold;
      color: $color-text-secondary;
    }
  }
</style>
