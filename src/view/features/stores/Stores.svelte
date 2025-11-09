<script lang="ts">
  import { onMount } from 'svelte';
  import Layout from '../../layouts/Layout.svelte';
  import StoreDrawer from './StoreDrawer.svelte';
  import { SearchBar, ListItem, Button, Title, ConfirmModal } from '../../components/ui';
  import { apiService } from '../../services/api.service';
  import { UserRole } from '../../types/user.types';

  interface Store {
    id: string;
    name: string;
    logoUrl?: string | null;
    color?: string;
    createdAt: Date;
    updatedAt: Date;
  }

  // Recevoir les données du SSR
  let { stores: initialStores = [], user = null }: { stores?: Store[], user?: any } = $props();

  let stores: Store[] = $state(initialStores);
  let loading = $state(false);
  let error = $state('');

  // Pagination
  let currentPage = $state(0);
  let totalPages = $state(0);
  let totalStores = $state(initialStores.length);

  // Recherche
  let searchQuery = $state('');

  // Drawer
  let isDrawerOpen = $state(false);
  let editingStore = $state<Store | null>(null);

  // Modal de confirmation de suppression
  let isConfirmModalOpen = $state(false);
  let storeToDelete = $state<string | null>(null);

  // Debounce pour la recherche
  let searchTimeout: ReturnType<typeof setTimeout>;

  onMount(() => {
    // Si pas de données SSR, charger les enseignes
    if (stores.length === 0) {
      loadStores();
    }
  });

  async function loadStores() {
    loading = true;
    error = '';

    try {
      const searchParams = {
        search: searchQuery || undefined,
        limit: 20,
        page: currentPage,
      };

      const result = await apiService.searchStores(searchParams);
      stores = result.stores || [];
      totalStores = result.total || 0;
      totalPages = result.totalPages || 0;
    } catch (err: any) {
      error = err.message || 'Erreur lors du chargement des enseignes';
    } finally {
      loading = false;
    }
  }

  function handleSearchInput() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      currentPage = 0;
      loadStores();
    }, 300);
  }

  function openDrawer(store: Store | null = null) {
    editingStore = store;
    isDrawerOpen = true;
  }

  function closeDrawer() {
    isDrawerOpen = false;
    editingStore = null;
  }

  async function handleStoreSaved() {
    closeDrawer();
    await loadStores();
  }

  function openDeleteConfirmation(id: string) {
    storeToDelete = id;
    isConfirmModalOpen = true;
  }

  function cancelDelete() {
    storeToDelete = null;
    isConfirmModalOpen = false;
  }

  async function confirmDelete() {
    if (!storeToDelete) return;

    try {
      await apiService.deleteStore(storeToDelete);
      await loadStores();
      isConfirmModalOpen = false;
      storeToDelete = null;
    } catch (err: any) {
      alert('Erreur lors de la suppression : ' + err.message);
    }
  }

  function nextPage() {
    if (currentPage < totalPages - 1) {
      currentPage++;
      loadStores();
    }
  }

  function previousPage() {
    if (currentPage > 0) {
      currentPage--;
      loadStores();
    }
  }

  function goToPage(page: number) {
    currentPage = page;
    loadStores();
  }

  function isAdmin(): boolean {
    return user?.role === UserRole.ADMIN;
  }
</script>

<Layout title="Enseignes" currentPage="/stores" {user}>
<div id="stores" class="stores">
  <header class="stores__header">
    <Title level={1} size="xxl">🏪 Enseignes</Title>

    <div class="stores__actions">
      <SearchBar
        placeholder="Rechercher une enseigne..."
        bind:value={searchQuery}
        onInput={handleSearchInput}
      />

      <Button
        variant="primary"
        onclick={() => openDrawer()}
      >
        ➕ Ajouter une enseigne
      </Button>
    </div>
  </header>

  {#if error}
    <div class="stores__error">{error}</div>
  {/if}

  {#if loading}
    <div class="stores__loading">Chargement...</div>
  {:else if stores.length === 0}
    <div class="stores__empty">
      <p>Aucune enseigne trouvée.</p>
      <Button
        variant="primary"
        onclick={() => openDrawer()}
      >
        Ajouter la première enseigne
      </Button>
    </div>
  {:else}
    <div class="stores__list">
      <div class="stores__count">
        {totalStores} enseigne{totalStores > 1 ? 's' : ''}
      </div>

      <div class="stores__grid">
        {#each stores as store (store.id)}
          <ListItem
            title={store.name}
            imageUrl={store.logoUrl}
            imagePlaceholder={store.name.charAt(0).toUpperCase()}
            onEdit={isAdmin() ? () => openDrawer(store) : undefined}
            onDelete={isAdmin() ? () => openDeleteConfirmation(store.id) : undefined}
          />
        {/each}
      </div>

      {#if totalPages > 1}
        <div class="stores__pagination">
          <Button
            variant="secondary"
            label="← Précédent"
            onClick={previousPage}
            disabled={currentPage === 0}
          />

          <div class="stores__pagination-info">
            Page {currentPage + 1} sur {totalPages}
          </div>

          <Button
            variant="secondary"
            label="Suivant →"
            onClick={nextPage}
            disabled={currentPage >= totalPages - 1}
          />
        </div>
      {/if}
    </div>
  {/if}
</div>
</Layout>

<!-- Drawer -->
<StoreDrawer
  isOpen={isDrawerOpen}
  store={editingStore}
  onSave={handleStoreSaved}
  onClose={closeDrawer}
/>

<!-- Modal de confirmation de suppression -->
<ConfirmModal
  isOpen={isConfirmModalOpen}
  title="Supprimer l'enseigne"
  message="Êtes-vous sûr de vouloir supprimer cette enseigne ? Cette action est irréversible."
  onConfirm={confirmDelete}
  onCancel={cancelDelete}
/>

<style lang="scss">
  $primary-color: #667eea;
  $secondary-color: #764ba2;
  $danger-color: #e53e3e;
  $white: #fff;
  $text-dark: #333;
  $text-gray: #666;
  $border-color: #e0e0e0;
  $spacing-base: 1rem;
  $spacing-xs: $spacing-base * 0.5;
  $spacing-sm: $spacing-base * 0.75;
  $spacing-md: $spacing-base * 1.5;
  $spacing-lg: $spacing-base * 2;
  $spacing-xl: $spacing-base * 3;

  .stores {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: $spacing-lg;

    &__header {
      margin-bottom: $spacing-lg;
    }

    &__actions {
      display: flex;
      gap: $spacing-md;
      margin-top: $spacing-md;
      flex-wrap: wrap;

      @media (max-width: 768px) {
        flex-direction: column;
      }
    }

    &__error {
      padding: $spacing-md;
      background: rgba(229, 62, 62, 0.1);
      border: 2px solid $danger-color;
      border-radius: 8px;
      color: $danger-color;
      font-weight: 600;
    }

    &__loading {
      text-align: center;
      padding: $spacing-xl;
      color: $text-gray;
      font-size: 1.1rem;
    }

    &__empty {
      text-align: center;
      padding: $spacing-xl;

      p {
        color: $text-gray;
        font-size: 1.1rem;
        margin-bottom: $spacing-md;
      }
    }

    &__list {
      display: flex;
      flex-direction: column;
      gap: $spacing-md;
    }

    &__count {
      color: $text-gray;
      font-size: 0.95rem;
      font-weight: 600;
      padding: $spacing-xs 0;
    }

    &__grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: $spacing-md;

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    }

    &__pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: $spacing-md;
      padding: $spacing-lg 0;
      margin-top: $spacing-md;

      &-info {
        color: $text-gray;
        font-size: 0.95rem;
        font-weight: 600;
      }
    }
  }
</style>
