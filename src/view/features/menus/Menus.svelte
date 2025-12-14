<script lang="ts">
  import { onMount } from 'svelte';
  import Layout from '../../layouts/Layout.svelte';
  import { MenuDrawer } from '../menu-drawer';
  import { Card, Button, ConfirmModal, PageHero, Badge, IconButton, FilterGroup } from '../../components/ui';
  import { apiService } from '../../services/api.service';
  import type { Menu } from '../../types/menu.types';
  import { UserRole } from '../../types/user.types';
  import { UtensilsCrossed, Pencil, Trash2, Users } from 'lucide-svelte';

  // Recevoir les données du SSR
  let { menus: initialMenus = [], user = null }: { menus?: Menu[], user?: any } = $props();

  let menus: Menu[] = $state(initialMenus);
  let loading = $state(false);
  let error = $state('');

  // Pagination
  let currentPage = $state(0);
  let totalPages = $state(0);
  let totalMenus = $state(initialMenus.length);

  // Filtres et recherche
  let searchQuery = $state('');
  let sortBy = $state<'alpha' | 'date'>('alpha');
  let filter = $state<'all' | 'mine'>('all');

  // Modal de confirmation de suppression
  let isConfirmModalOpen = $state(false);
  let menuToDelete = $state<string | null>(null);
  let deleteError = $state<string>('');

  // Drawer pour ajouter/éditer un menu (on va le créer après)
  let isDrawerOpen = $state(false);
  let editingMenu = $state<Menu | null>(null);

  // Debounce pour la recherche
  let searchTimeout: ReturnType<typeof setTimeout>;

  onMount(() => {
    if (menus.length === 0) {
      loadMenus();
    }
  });

  async function loadMenus() {
    loading = true;
    error = '';

    try {
      const searchParams = {
        search: searchQuery || undefined,
        sortBy,
        filter,
        limit: 20,
        page: currentPage,
      };

      const result = await apiService.searchMenus(searchParams);
      menus = result.data || result.items || [];
      totalMenus = result.pagination?.total || menus.length;
      totalPages = result.pagination?.totalPages || Math.ceil(totalMenus / 20);
    } catch (err: any) {
      error = err.message || 'Erreur lors du chargement des menus';
      menus = [];
    } finally {
      loading = false;
    }
  }

  function handleSearchInput() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      currentPage = 0;
      loadMenus();
    }, 300);
  }

  function handleFilterChange() {
    currentPage = 0;
    loadMenus();
  }

  function openDrawer(menu: Menu | null = null) {
    editingMenu = menu;
    isDrawerOpen = true;
  }

  function closeDrawer() {
    isDrawerOpen = false;
    editingMenu = null;
  }

  async function handleMenuSaved() {
    closeDrawer();
    await loadMenus();
  }

  function openDeleteConfirmation(id: string) {
    menuToDelete = id;
    isConfirmModalOpen = true;
    deleteError = '';
  }

  function cancelDelete() {
    menuToDelete = null;
    isConfirmModalOpen = false;
    deleteError = '';
  }

  async function confirmDelete() {
    if (!menuToDelete) return;

    try {
      await apiService.deleteMenu(menuToDelete);
      await loadMenus();
      isConfirmModalOpen = false;
      menuToDelete = null;
      deleteError = '';
    } catch (err: any) {
      deleteError = err.message || 'Erreur lors de la suppression';
    }
  }

  function nextPage() {
    if (currentPage < totalPages - 1) {
      currentPage++;
      loadMenus();
    }
  }

  function previousPage() {
    if (currentPage > 0) {
      currentPage--;
      loadMenus();
    }
  }

  function goToPage(page: number) {
    currentPage = page;
    loadMenus();
  }

  function canModifyMenu(menu: Menu): boolean {
    if (!user) return false;
    if (user.role === UserRole.ADMIN) return true;
    return menu.userId === user.id;
  }

  function getMenuItemsSummary(menu: Menu): string {
    const recipeCount = menu.items?.filter(i => i.recipeId).length || 0;
    const ingredientCount = menu.items?.filter(i => i.ingredientId).length || 0;
    const parts = [];
    if (recipeCount > 0) parts.push(`${recipeCount} recette${recipeCount > 1 ? 's' : ''}`);
    if (ingredientCount > 0) parts.push(`${ingredientCount} ingr.`);
    return parts.join(' • ') || 'Aucun item';
  }
</script>

<Layout title="Menus" currentPage="/menus" {user}>
<div id="menus" class="menus">
  <PageHero
    title="Mes menus"
    actionLabel="+ Ajouter un menu"
    onAction={() => openDrawer()}
    showSearch={true}
    searchPlaceholder="Rechercher un menu..."
    bind:searchValue={searchQuery}
    onSearchInput={handleSearchInput}
  >
    {#snippet filters()}
      <FilterGroup
        label="Affichage"
        bind:value={filter}
        onchange={handleFilterChange}
        options={[
          { value: 'all', label: 'Tous les menus' },
          { value: 'mine', label: 'Mes menus' }
        ]}
        inverse={true}
      />

      <FilterGroup
        label="Trier par"
        bind:value={sortBy}
        onchange={handleFilterChange}
        options={[
          { value: 'alpha', label: 'Alphabétique' },
          { value: 'date', label: 'Date d\'ajout' }
        ]}
        inverse={true}
      />
    {/snippet}
  </PageHero>

  {#if error}
    <div class="menus__error">{error}</div>
  {/if}

  {#if loading}
    <div class="menus__loading">Chargement...</div>
  {:else if menus.length === 0}
    <div class="menus__empty">
      <div class="menus__empty-icon">
        <UtensilsCrossed size={80} />
      </div>
      <h2 class="menus__empty-title">Aucun menu trouvé</h2>
      <p class="menus__empty-text">
        {searchQuery
          ? 'Essayez de modifier votre recherche'
          : 'Commencez par créer votre premier menu composé!'}
      </p>
      {#if !searchQuery}
        <Button onclick={() => openDrawer()}>
          Ajouter un menu
        </Button>
      {/if}
    </div>
  {:else}
    <div class="menus__grid">
      {#each menus as menu (menu.id)}
        <Card
          title={menu.name}
          subtitle={menu.description}
          imageUrl={menu.imageUrl}
          imagePlaceholder="🍽️"
          clickable={true}
          onclick={() => window.location.href = `/menus/${menu.id}`}
        >
          {#snippet footer()}
            <div class="menu-card-footer">
              <div class="menu-card-info">
                <Badge variant="neutral" size="xs">
                  <Users size={14} /> {menu.servings} pers.
                </Badge>
                <Badge variant="neutral" size="xs">
                  {getMenuItemsSummary(menu)}
                </Badge>
              </div>
              {#if canModifyMenu(menu)}
                <div class="menu-card-actions">
                  <IconButton
                    variant="ghost"
                    size="medium"
                    onclick={(e) => {
                      e.stopPropagation();
                      openDrawer(menu);
                    }}
                    ariaLabel="Modifier"
                  >
                    <Pencil size={18} />
                  </IconButton>
                  <IconButton
                    variant="danger"
                    size="medium"
                    onclick={(e) => {
                      e.stopPropagation();
                      openDeleteConfirmation(menu.id);
                    }}
                    ariaLabel="Supprimer"
                  >
                    <Trash2 size={18} />
                  </IconButton>
                </div>
              {/if}
            </div>
          {/snippet}
        </Card>
      {/each}
    </div>

    <!-- Pagination -->
    {#if totalPages > 1}
      <div class="menus__pagination">
        <Button
          variant="secondary"
          onclick={previousPage}
          disabled={currentPage === 0}
        >
          ← Précédent
        </Button>

        <div class="menus__pagination-pages">
          {#each Array(totalPages) as _, i}
            <button
              class="menus__pagination-page"
              class:menus__pagination-page--active={i === currentPage}
              onclick={() => goToPage(i)}
            >
              {i + 1}
            </button>
          {/each}
        </div>

        <Button
          variant="secondary"
          onclick={nextPage}
          disabled={currentPage >= totalPages - 1}
        >
          Suivant →
        </Button>
      </div>

      <p class="menus__pagination-info">
        Page {currentPage + 1} sur {totalPages} • {totalMenus} menu{totalMenus > 1 ? 's' : ''}
      </p>
    {/if}
  {/if}
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

<!-- Drawer pour ajouter/éditer un menu -->
<MenuDrawer
  isOpen={isDrawerOpen}
  menu={editingMenu}
  onSave={handleMenuSaved}
  onClose={closeDrawer}
/>
</Layout>

<style lang="scss">
  @use '../../styles/variables' as *;

  .menus {
    display: flex;
    flex-direction: column;

    &__error {
      padding: $spacing-base;
      background: $color-background-danger;
      border: 1px solid $color-danger;
      border-radius: 8px;
      color: $color-danger;
    }

    &__loading {
      text-align: center;
      padding: $spacing-base * 4;
      color: $color-gray-600;
      font-size: 1.2rem;
    }

    &__empty {
      text-align: center;
      padding: $spacing-base * 4 $spacing-base * 2;
      background: $color-white;
      border-radius: 12px;
      box-shadow: 0 2px 12px $color-black-alpha-08;
    }

    &__empty-icon {
      font-size: 4rem;
      margin-bottom: $spacing-base;
      color: $color-gray-400;
    }

    &__empty-title {
      color: $color-gray-800;
      margin: 0 0 $spacing-base * 0.5 0;
    }

    &__empty-text {
      color: $color-gray-600;
      margin: 0 0 $spacing-base * 2 0;
    }

    &__grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: $spacing-base * 1.5;

      @media (min-width: 640px) {
        grid-template-columns: repeat(2, 1fr);
      }

      @media (min-width: 1024px) {
        grid-template-columns: repeat(3, 1fr);
      }

      @media (min-width: 1536px) {
        grid-template-columns: repeat(4, 1fr);
      }
    }

    &__pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: $spacing-base;
      margin-top: $spacing-base * 2;
    }

    &__pagination-pages {
      display: flex;
      gap: $spacing-base * 0.5;
    }

    &__pagination-page {
      width: 40px;
      height: 40px;
      border: 2px solid $color-gray-200;
      background: $color-white;
      border-radius: 8px;
      cursor: pointer;
      transition: all $transition-base;

      &:hover {
        border-color: $brand-primary;
        color: $brand-primary;
      }

      &--active {
        background: $brand-primary;
        color: $color-white;
        border-color: transparent;
      }
    }

    &__pagination-info {
      text-align: center;
      color: $color-gray-600;
      font-size: 0.9rem;
      margin-top: $spacing-base;
    }
  }

  .menu-card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: $spacing-base;
  }

  .menu-card-info {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-base * 0.5;
    flex: 1;

    :global(.badge) {
      :global(svg) {
        flex-shrink: 0;
      }
    }
  }

  .menu-card-actions {
    display: flex;
    gap: $spacing-base * 0.5;
  }
</style>
