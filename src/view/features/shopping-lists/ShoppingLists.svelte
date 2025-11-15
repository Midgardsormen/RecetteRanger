<script lang="ts">
  import Layout from '../../layouts/Layout.svelte';
  import { Button, IconButton, Badge, PageHero, Card, ConfirmModal } from '../../components/ui';
  import { GenerateShoppingListDrawer } from './components';
  import { apiService } from '../../services/api.service';
  import type { ShoppingList } from '../../types/shopping-list.types';
  import { Calendar, ShoppingCart, Trash2 } from 'lucide-svelte';

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

  function getStatusLabel(status: string): string {
    const labels = {
      DRAFT: 'Brouillon',
      IN_PROGRESS: 'En cours',
      COMPLETED: 'Terminée',
      ARCHIVED: 'Archivée'
    };
    return labels[status] || status;
  }

  function getStatusVariant(status: string): 'neutral' | 'info' | 'success' | 'warning' {
    const variants = {
      DRAFT: 'neutral' as const,
      IN_PROGRESS: 'info' as const,
      COMPLETED: 'success' as const,
      ARCHIVED: 'warning' as const
    };
    return variants[status] || 'neutral';
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
      <div class="loading-container">
        <div class="spinner"></div>
        <p>Chargement des listes...</p>
      </div>
    {:else if shoppingLists.length === 0}
      <div class="empty-state">
        <div class="empty-icon">
          <ShoppingCart size={64} />
        </div>
        <h2>Aucune liste de courses</h2>
        <p>Générez une liste depuis votre planning de repas pour commencer !</p>
        <Button onclick={handleGenerateClick}>Générer ma première liste</Button>
      </div>
    {:else}
      <div class="lists-grid">
        {#each shoppingLists as list}
          <Card
            title={list.name}
            clickable={true}
            onclick={() => handleListClick(list.id)}
          >
            {#snippet children()}
              <div class="list-info">
                {#if list.fromDate && list.toDate}
                  <p class="date-range">
                    <Calendar size={16} />
                    {new Date(list.fromDate).toLocaleDateString('fr-FR')} - {new Date(list.toDate).toLocaleDateString('fr-FR')}
                  </p>
                {/if}
                <p class="item-count">
                  {list.items.length} article{list.items.length > 1 ? 's' : ''}
                  {#if list.items.filter(i => i.checked).length > 0}
                    · {list.items.filter(i => i.checked).length} coché{list.items.filter(i => i.checked).length > 1 ? 's' : ''}
                  {/if}
                </p>
              </div>
            {/snippet}
            {#snippet footer()}
              <div class="list-footer">
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
    gap: 2rem;
  }

  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    gap: 1.5rem;

    p {
      color: var(--text-secondary);
      font-size: 1.1rem;
    }
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

  .empty-state {
    text-align: center;
    padding: 4rem 2rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px $color-black-alpha-10;

    .empty-icon {
      color: $color-text-tertiary;
      margin-bottom: 1rem;
    }

    h2 {
      margin: 0 0 0.5rem 0;
      color: var(--text-color);
    }

    p {
      margin: 0 0 2rem 0;
      color: var(--text-secondary);
    }
  }

  .lists-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;

    @media (min-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (min-width: 1024px) {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .list-info {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;

    p {
      margin: 0;
      font-size: 0.95rem;
      color: var(--text-secondary);
      display: flex;
      align-items: center;
      gap: $spacing-xs;
    }

    .date-range {
      font-weight: 500;
    }

    .item-count {
      color: var(--text-tertiary);
      font-size: 0.9rem;
    }
  }

  .list-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: $spacing-base;
  }
</style>
