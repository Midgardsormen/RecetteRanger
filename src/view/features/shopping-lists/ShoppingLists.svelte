<script lang="ts">
  import Layout from '../../layouts/Layout.svelte';
  import { Button, IconButton, Badge, PageHero, Card, ConfirmModal } from '../../components/ui';
  import { GenerateShoppingListDrawer } from './components';
  import { apiService } from '../../services/api.service';
  import type { ShoppingList } from '../../types/shopping-list.types';
  import { Calendar, ShoppingCart, Trash2 } from 'lucide-svelte';
  import { getStatusLabel, getStatusVariant } from './shopping-list.helpers';

  let { user }: { user: any } = $props();

  // État
  let shoppingLists = $state<ShoppingList[]>([]);
  let loading = $state(true);
  let showGenerateDrawer = $state(false);

  // Modal de confirmation de suppression
  let isConfirmModalOpen = $state(false);
  let listToDelete = $state<string | null>(null);
  let deleteError = $state<string>('');

  // Charger les listes
  async function loadShoppingLists() {
    if (!user) return;

    loading = true;
    try {
      const lists = await apiService.getShoppingLists();
      shoppingLists = lists;
    } catch (err) {
      console.error('Erreur lors du chargement des listes:', err);
    } finally {
      loading = false;
    }
  }

  function handleGenerateClick() {
    showGenerateDrawer = true;
  }

  function handleListClick(listId: string) {
    window.location.href = `/shopping-lists/${listId}`;
  }

  function openDeleteConfirmation(event: Event, listId: string) {
    event.stopPropagation(); // Empêcher la navigation vers le détail
    listToDelete = listId;
    isConfirmModalOpen = true;
    deleteError = '';
  }

  function cancelDelete() {
    listToDelete = null;
    isConfirmModalOpen = false;
    deleteError = '';
  }

  async function confirmDelete() {
    if (!listToDelete) return;

    try {
      await apiService.deleteShoppingList(listToDelete);
      // Retirer la liste de l'état local
      shoppingLists = shoppingLists.filter(list => list.id !== listToDelete);
      isConfirmModalOpen = false;
      listToDelete = null;
      deleteError = '';
    } catch (err: any) {
      deleteError = err.message || 'Erreur lors de la suppression';
    }
  }

  // Charger les données au montage
  $effect(() => {
    if (user) {
      loadShoppingLists();
    }
  });
</script>

<Layout title="Listes de courses" currentPage="/shopping-lists" {user}>
  <div class="shopping-lists">
    <PageHero
      title="Mes listes de courses"
      actionLabel="+ Générer depuis le planning"
      onAction={handleGenerateClick}
    />

    {#if loading}
      <div class="shopping-lists__loading">
        <div class="shopping-lists__spinner"></div>
        <p>Chargement des listes...</p>
      </div>
    {:else if shoppingLists.length === 0}
      <div class="shopping-lists__empty">
        <div class="shopping-lists__empty-icon">
          <ShoppingCart size={64} />
        </div>
        <h2>Aucune liste de courses</h2>
        <p>Générez une liste depuis votre planning de repas pour commencer !</p>
      </div>
    {:else}
      <div class="shopping-lists__grid">
        {#each shoppingLists as list}
          <Card
            title={list.name}
            clickable={true}
            onclick={() => handleListClick(list.id)}
          >
            {#snippet children()}
              <div class="shopping-lists__list-info">
                {#if list.fromDate && list.toDate}
                  <p class="shopping-lists__list-info-date">
                    <Calendar size={16} />
                    {new Date(list.fromDate).toLocaleDateString('fr-FR')} - {new Date(list.toDate).toLocaleDateString('fr-FR')}
                  </p>
                {/if}
                <p class="shopping-lists__list-info-count">
                  {list.items.length} article{list.items.length > 1 ? 's' : ''}
                  {#if list.items.filter(i => i.checked).length > 0}
                    · {list.items.filter(i => i.checked).length} coché{list.items.filter(i => i.checked).length > 1 ? 's' : ''}
                  {/if}
                </p>
              </div>
            {/snippet}
            {#snippet footer()}
              <div class="shopping-lists__list-footer">
                <Badge variant={getStatusVariant(list.status)} size="small" pill>
                  {getStatusLabel(list.status)}
                </Badge>
                <IconButton
                  variant="danger"
                  size="medium"
                  onclick={(e) => openDeleteConfirmation(e, list.id)}
                  ariaLabel="Supprimer"
                >
                  <Trash2 size={18} />
                </IconButton>
              </div>
            {/snippet}
          </Card>
        {/each}
      </div>
    {/if}
  </div>
</Layout>

<GenerateShoppingListDrawer
  isOpen={showGenerateDrawer}
  onClose={() => { showGenerateDrawer = false; }}
  onGenerate={loadShoppingLists}
/>

<!-- Modal de confirmation de suppression -->
<ConfirmModal
  isOpen={isConfirmModalOpen}
  title="Supprimer la liste de courses"
  message={deleteError || "Êtes-vous sûr de vouloir supprimer cette liste de courses ? Cette action est irréversible."}
  confirmLabel="Supprimer"
  cancelLabel="Annuler"
  onConfirm={confirmDelete}
  onCancel={cancelDelete}
  variant={deleteError ? 'danger' : 'warning'}
/>

<style lang="scss">
  @use '../../styles/variables' as *;

  .shopping-lists {
    display: flex;
    flex-direction: column;

    &__loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 400px;
      gap: $spacing-lg;

      p {
        color: $color-text-secondary;
        font-size: $font-size-lg;
      }
    }

    &__spinner {
      width: 48px;
      height: 48px;
      border: 4px solid $color-border-primary;
      border-top-color: $brand-primary;
      border-radius: $radius-full;
      animation: spin 1s linear infinite;
    }

    &__empty {
      text-align: center;
      padding: $spacing-3xl $spacing-xl;
      background: $color-white;
      border-radius: $radius-xl;
      box-shadow: $shadow-md;

      &-icon {
        color: $color-text-tertiary;
        margin-bottom: $spacing-base;
      }

      h2 {
        margin: 0 0 $spacing-sm 0;
        color: $color-text-primary;
        font-size: $font-size-2xl;
        font-weight: $font-weight-bold;
      }

      p {
        margin: 0 0 $spacing-xl 0;
        color: $color-text-secondary;
        font-size: $font-size-base;
      }
    }

    &__grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: $spacing-lg;

      @media (min-width: $breakpoint-md) {
        grid-template-columns: repeat(2, 1fr);
      }

      @media (min-width: $breakpoint-lg) {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    &__list-info {
      display: flex;
      flex-direction: column;
      gap: $spacing-sm;

      p {
        margin: 0;
        font-size: $font-size-base;
        color: $color-text-secondary;
        display: flex;
        align-items: center;
        gap: $spacing-xs;
      }

      &-date {
        font-weight: $font-weight-medium;
      }

      &-count {
        color: $color-text-tertiary;
        font-size: $font-size-sm;
      }
    }

    &__list-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: $spacing-base;
    }
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
</style>
