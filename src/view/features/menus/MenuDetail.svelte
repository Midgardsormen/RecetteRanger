<script lang="ts">
  import Layout from '../../layouts/Layout.svelte';
  import { MenuDrawer } from '../menu-drawer';
  import { Button, IconButton, Hero, Breadcrumb, Card, Badge, ConfirmModal } from '../../components/ui';
  import { Users, Pencil, Trash2, UtensilsCrossed, ChefHat, Apple } from 'lucide-svelte';
  import { apiService } from '../../services/api.service';
  import type { Menu, MenuItem } from '../../types/menu.types';
  import type { User } from '../../types/user.types';
  import { UserRole } from '../../types/user.types';

  // Recevoir les données du SSR
  let { menu: initialMenu, user = null }: { menu: Menu, user?: User | null } = $props();

  let menu = $state<Menu>(initialMenu);
  let servings = $state(initialMenu.servings);

  // Drawer pour éditer le menu
  let isDrawerOpen = $state(false);

  // Modal de confirmation de suppression
  let isConfirmModalOpen = $state(false);
  let deleteError = $state<string>('');

  function goBack() {
    window.location.href = '/menus';
  }

  function canModifyMenu(): boolean {
    if (!user) return false;
    if (user.role === UserRole.ADMIN) return true;
    return menu.userId === user.id;
  }

  function openDrawer() {
    isDrawerOpen = true;
  }

  function closeDrawer() {
    isDrawerOpen = false;
  }

  async function handleMenuSaved() {
    closeDrawer();
    // Recharger la page pour voir les changements
    window.location.reload();
  }

  function openDeleteConfirmation() {
    isConfirmModalOpen = true;
    deleteError = '';
  }

  function cancelDelete() {
    isConfirmModalOpen = false;
    deleteError = '';
  }

  async function confirmDelete() {
    try {
      await apiService.deleteMenu(menu.id);
      window.location.href = '/menus';
    } catch (err: any) {
      deleteError = err.message || 'Erreur lors de la suppression';
    }
  }

  function incrementServings() {
    servings++;
  }

  function decrementServings() {
    if (servings > 1) {
      servings--;
    }
  }

  // Calculer le multiplicateur de quantités
  let multiplier = $derived(servings / (menu.servings || 1));

  function adjustQuantity(quantity: number | null): string {
    if (!quantity) return '';
    const adjusted = quantity * multiplier;
    return adjusted % 1 === 0 ? adjusted.toString() : adjusted.toFixed(1);
  }

  // Grouper les items par type
  let recipeItems = $derived(menu.items?.filter(i => i.recipeId) || []);
  let ingredientItems = $derived(menu.items?.filter(i => i.ingredientId) || []);
</script>

<Layout title={menu.name} currentPage="/menus" {user}>
  <div class="menu-detail">
    <Breadcrumb
      mode="simple"
      backLabel="Retour aux menus"
      onBack={goBack}
    />

    <Hero
      variant="grid"
      backgroundImage="/assets/images/ChatGPT Image 11 nov. 2025, 00_10_06.png"
      backgroundColor="var(--brand-quaternary)"
      overlay={true}
      overlayOpacity={0.85}
    >
      {#if menu.imageUrl}
        <img src={menu.imageUrl} alt={menu.name} class="menu-image" />
      {:else}
        <div class="menu-image-placeholder">
          <UtensilsCrossed size={80} />
        </div>
      {/if}

      <div class="menu-title-section">
        <h1>{menu.name}</h1>

        {#if menu.description}
          <p class="menu-description">{menu.description}</p>
        {/if}

        <div class="menu-meta">
          <div class="meta-item servings-control">
            <Users class="meta-icon" size={20} />
            <IconButton onclick={decrementServings} disabled={servings <= 1} size="small" variant="ghost-inverse">−</IconButton>
            <span class="servings-value">{servings} {servings > 1 ? 'personnes' : 'personne'}</span>
            <IconButton onclick={incrementServings} size="small" variant="ghost-inverse">+</IconButton>
          </div>

          {#if canModifyMenu()}
            <div class="menu-actions">
              <Button variant="secondary-inverse" size="medium" onclick={openDrawer}>
                <Pencil size={18} /> Modifier
              </Button>
              <Button variant="danger-inverse" size="medium" onclick={openDeleteConfirmation}>
                <Trash2 size={18} /> Supprimer
              </Button>
            </div>
          {/if}
        </div>
      </div>
    </Hero>

    <!-- Section Items du menu -->
    <div class="menu-content">
      {#if recipeItems.length > 0}
        <div class="section recipes-section">
          <h2><ChefHat size={24} style="display: inline-block; vertical-align: middle; margin-right: 8px;" /> Recettes</h2>
          <div class="items-grid">
            {#each recipeItems as item (item.id)}
              <Card
                title={item.recipe?.label || 'Recette'}
                subtitle={item.recipe?.description}
                imageUrl={item.recipe?.imageUrl}
                imagePlaceholder="🍳"
                clickable={true}
                onclick={() => window.location.href = `/recettes/${item.recipeId}`}
              >
                {#snippet footer()}
                  <div class="item-footer">
                    <Badge variant="neutral" size="xs">
                      <Users size={14} /> {Math.round(item.servings * multiplier)} pers.
                    </Badge>
                  </div>
                {/snippet}
              </Card>
            {/each}
          </div>
        </div>
      {/if}

      {#if ingredientItems.length > 0}
        <div class="section ingredients-section">
          <h2><Apple size={24} style="display: inline-block; vertical-align: middle; margin-right: 8px;" /> Ingrédients</h2>
          <ul class="ingredients-list">
            {#each ingredientItems as item (item.id)}
              <li class="ingredient-item">
                <span class="ingredient-label">{item.ingredient?.label || 'Ingrédient'}</span>
                {#if item.quantity}
                  <span class="ingredient-quantity">
                    {adjustQuantity(Number(item.quantity))} {item.unit || ''}
                  </span>
                {/if}
              </li>
            {/each}
          </ul>
        </div>
      {/if}

      {#if recipeItems.length === 0 && ingredientItems.length === 0}
        <div class="empty-state">
          <UtensilsCrossed size={64} />
          <p>Ce menu ne contient aucun item</p>
          {#if canModifyMenu()}
            <Button onclick={openDrawer}>Ajouter des items</Button>
          {/if}
        </div>
      {/if}
    </div>
  </div>

  <!-- Modal de confirmation de suppression -->
  <ConfirmModal
    isOpen={isConfirmModalOpen}
    title="Supprimer le menu"
    message={deleteError || "Êtes-vous sûr de vouloir supprimer ce menu ? Cette action est irréversible."}
    confirmLabel="Supprimer"
    cancelLabel="Annuler"
    onConfirm={confirmDelete}
    onCancel={cancelDelete}
    variant={deleteError ? 'danger' : 'warning'}
  />

  <!-- Drawer pour éditer le menu -->
  <MenuDrawer
    isOpen={isDrawerOpen}
    menu={menu}
    onSave={handleMenuSaved}
    onClose={closeDrawer}
  />
</Layout>

<style lang="scss">
  @use '../../styles/variables' as *;

  .menu-detail {
    display: flex;
    flex-direction: column;
    gap: $spacing-lg;
  }

  .menu-image,
  .menu-image-placeholder {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: $radius-lg;
  }

  .menu-image-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    background: $color-white-alpha-20;
    color: $color-white;
  }

  .menu-title-section {
    display: flex;
    flex-direction: column;
    gap: $spacing-base;

    h1 {
      margin: 0;
      color: $color-white;
      font-size: $font-size-3xl;
      font-weight: $font-weight-bold;
      text-shadow: $shadow-decorative-navigation-hover;
    }

    .menu-description {
      margin: 0;
      color: $color-white-alpha-90;
      font-size: $font-size-lg;
      line-height: 1.6;
    }
  }

  .menu-meta {
    display: flex;
    align-items: center;
    gap: $spacing-base;
    flex-wrap: wrap;
    margin-top: $spacing-base;

    @media (max-width: $breakpoint-md) {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: $spacing-xs;
    color: $color-white;
    font-size: $font-size-lg;
    font-weight: $font-weight-medium;

    .meta-icon {
      flex-shrink: 0;
      color: $color-white-alpha-90;
    }
  }

  .servings-control {
    display: flex;
    align-items: center;
    gap: $spacing-xs;
    background: $color-white-alpha-20;
    padding: $spacing-xs $spacing-base;
    border-radius: $radius-md;
    backdrop-filter: blur(10px);

    .servings-value {
      min-width: 120px;
      text-align: center;
    }
  }

  .menu-actions {
    display: flex;
    gap: $spacing-xs;
    margin-left: auto;

    @media (max-width: $breakpoint-md) {
      margin-left: 0;
      width: 100%;

      :global(button) {
        flex: 1;
      }
    }
  }

  .menu-content {
    display: flex;
    flex-direction: column;
    gap: $spacing-xl;
    padding-bottom: $spacing-xl;
  }

  .section {
    background: $color-white;
    padding: $spacing-lg;
    border-radius: $radius-lg;
    box-shadow: 0 2px 12px $color-black-alpha-08;

    h2 {
      margin: 0 0 $spacing-lg 0;
      color: $color-gray-800;
      font-size: $font-size-2xl;
      font-weight: $font-weight-semibold;
    }
  }

  .items-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: $spacing-base;

    @media (min-width: $breakpoint-md) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (min-width: $breakpoint-lg) {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .item-footer {
    display: flex;
    gap: $spacing-xs;
  }

  .ingredients-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
  }

  .ingredient-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $spacing-sm $spacing-base;
    background: $color-gray-50;
    border-radius: $radius-md;
    transition: background $transition-base;

    &:hover {
      background: $color-gray-100;
    }

    .ingredient-label {
      font-weight: $font-weight-medium;
      color: $color-gray-800;
    }

    .ingredient-quantity {
      color: $color-gray-600;
      font-size: $font-size-sm;
      white-space: nowrap;
    }
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: $spacing-xl * 2;
    text-align: center;
    color: $color-gray-500;

    :global(svg) {
      margin-bottom: $spacing-base;
      color: $color-gray-400;
    }

    p {
      margin: 0 0 $spacing-lg 0;
      font-size: $font-size-lg;
    }
  }
</style>
