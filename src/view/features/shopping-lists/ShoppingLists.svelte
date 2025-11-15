<script lang="ts">
  import Layout from '../../layouts/Layout.svelte';
  import { Button, IconButton, Badge } from '../../components/ui';
  import { GenerateShoppingListDrawer } from './components';
  import { apiService } from '../../services/api.service';
  import type { ShoppingList } from '../../types/shopping-list.types';

  let { user }: { user: any } = $props();

  // État
  let shoppingLists = $state<ShoppingList[]>([]);
  let loading = $state(true);
  let showGenerateDrawer = $state(false);

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

  async function handleDeleteList(event: Event, listId: string) {
    event.stopPropagation(); // Empêcher la navigation vers le détail

    if (!confirm('Supprimer cette liste de courses ?')) return;

    try {
      await apiService.deleteShoppingList(listId);
      // Retirer la liste de l'état local
      shoppingLists = shoppingLists.filter(list => list.id !== listId);
    } catch (err: any) {
      alert('Erreur lors de la suppression : ' + err.message);
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
    <div class="shopping-lists__header">
      <div class="header-content">
        <h1>🛒 Mes listes de courses</h1>
        <p class="subtitle">Gérez vos courses facilement</p>
      </div>
      <Button onclick={handleGenerateClick}>
        ✨ Générer depuis le planning
      </Button>
    </div>

    {#if loading}
      <div class="loading-container">
        <div class="spinner"></div>
        <p>Chargement des listes...</p>
      </div>
    {:else if shoppingLists.length === 0}
      <div class="empty-state">
        <div class="empty-icon">🛒</div>
        <h2>Aucune liste de courses</h2>
        <p>Générez une liste depuis votre planning de repas pour commencer !</p>
        <Button onclick={handleGenerateClick}>Générer ma première liste</Button>
      </div>
    {:else}
      <div class="lists-grid">
        {#each shoppingLists as list}
          <div class="list-card" onclick={() => handleListClick(list.id)}>
            <div class="list-header">
              <h3>{list.name}</h3>
              <div class="list-header-actions">
                <Badge variant={getStatusVariant(list.status)} size="small" pill>
                  {getStatusLabel(list.status)}
                </Badge>
                <IconButton
                  icon="🗑️"
                  onclick={(e) => handleDeleteList(e, list.id)}
                  size="small"
                  variant="danger"
                />
              </div>
            </div>
            <div class="list-info">
              {#if list.fromDate && list.toDate}
                <p class="date-range">
                  📅 {new Date(list.fromDate).toLocaleDateString('fr-FR')} - {new Date(list.toDate).toLocaleDateString('fr-FR')}
                </p>
              {/if}
              <p class="item-count">
                {list.items.length} article{list.items.length > 1 ? 's' : ''}
                {#if list.items.filter(i => i.checked).length > 0}
                  · {list.items.filter(i => i.checked).length} coché{list.items.filter(i => i.checked).length > 1 ? 's' : ''}
                {/if}
              </p>
            </div>
          </div>
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

<style lang="scss">
  @use '../../styles/variables' as *;

  .shopping-lists {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .shopping-lists__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1.5rem;
  }

  .header-content {
    h1 {
      margin: 0;
      font-size: 2rem;
      color: var(--text-color);
    }

    .subtitle {
      margin: 0.5rem 0 0 0;
      color: var(--text-secondary);
      font-size: 1.1rem;
    }
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
      font-size: 4rem;
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
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1.5rem;
  }

  .list-card {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 2px 8px $color-black-alpha-10;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 16px $color-primary-alpha-20;
    }

    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
      gap: 1rem;

      h3 {
        margin: 0;
        font-size: 1.2rem;
        color: var(--text-color);
        flex: 1;
      }

      .list-header-actions {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .status {
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        font-size: 0.85rem;
        font-weight: 600;
        white-space: nowrap;

        &.status-draft {
          background: $color-gray-100;
          color: $color-gray-500;
        }

        &.status-in_progress {
          background: $color-background-info;
          color: $color-info-dark;
        }

        &.status-completed {
          background: $color-success-light;
          color: $color-success-dark;
        }

        &.status-archived {
          background: $color-gray-100;
          color: $color-gray-400;
        }
      }

      .delete-list-btn {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 1.1rem;
        padding: 0.25rem;
        opacity: 0.6;
        transition: opacity 0.2s;

        &:hover {
          opacity: 1;
        }
      }
    }

    .list-info {
      p {
        margin: 0.5rem 0 0 0;
        font-size: 0.95rem;
        color: var(--text-secondary);
      }

      .date-range {
        font-weight: 500;
      }

      .item-count {
        color: var(--text-tertiary);
        font-size: 0.9rem;
      }
    }
  }
</style>
