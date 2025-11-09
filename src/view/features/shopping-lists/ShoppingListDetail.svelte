<script lang="ts">
  import Layout from '../../layouts/Layout.svelte';
  import { Button, Input, ArticleAutocomplete } from '../../components/ui';
  import { SelectArticleDrawer } from './components';
  import { apiService } from '../../services/api.service';
  import type { ShoppingList, ShoppingListItem } from '../../types/shopping-list.types';
  import { getAisleLabel } from '../../utils/aisle-labels';

  interface Props {
    listId: string;
    user: any;
  }

  let { listId, user }: Props = $props();

  // État
  let shoppingList = $state<ShoppingList | null>(null);
  let loading = $state(true);
  let error = $state('');
  let newItemLabel = $state('');
  let selectedArticleId = $state<string | null>(null);
  let selectedArticleAisle = $state<string | null>(null);
  let editingItemId = $state<string | null>(null);
  let editQuantity = $state('');
  let editUnit = $state('');
  let showSelectArticleDrawer = $state(false);

  // Charger la liste
  async function loadShoppingList() {
    if (!listId) return;

    loading = true;
    try {
      const list = await apiService.getShoppingList(listId);
      shoppingList = list;
    } catch (err: any) {
      error = err.message || 'Erreur lors du chargement de la liste';
    } finally {
      loading = false;
    }
  }

  // Cocher/décocher un item
  async function toggleItem(item: ShoppingListItem) {
    try {
      await apiService.updateShoppingListItem(item.id, {
        checked: !item.checked
      });

      // Mettre à jour localement
      if (shoppingList) {
        const index = shoppingList.items.findIndex(i => i.id === item.id);
        if (index !== -1) {
          shoppingList.items[index].checked = !item.checked;
        }
      }
    } catch (err: any) {
      alert('Erreur : ' + err.message);
    }
  }

  // Supprimer un item
  async function deleteItem(itemId: string) {
    if (!confirm('Supprimer cet article ?')) return;

    try {
      await apiService.deleteShoppingListItem(itemId);

      // Retirer localement
      if (shoppingList) {
        shoppingList.items = shoppingList.items.filter(i => i.id !== itemId);
      }
    } catch (err: any) {
      alert('Erreur : ' + err.message);
    }
  }

  // Gérer la sélection d'un article depuis le drawer
  async function handleArticleSelected(article: any, quantity?: number | null, unit?: string | null) {
    if (!shoppingList) return;

    try {
      const newItem = await apiService.createShoppingListItem(shoppingList.id, {
        label: article.label,
        ingredientId: article.id,
        aisle: article.aisle,
        quantity: quantity,
        unit: unit,
        isManual: true,
        checked: false
      });

      shoppingList.items.push(newItem);
    } catch (err: any) {
      alert('Erreur : ' + err.message);
    }
  }

  // Ajouter un item à la liste
  async function addManualItem() {
    if (!newItemLabel.trim() || !shoppingList) return;

    
    try {
      const newItem = await apiService.createShoppingListItem(shoppingList.id, {
        label: newItemLabel.trim(),
        ingredientId: selectedArticleId,
        aisle: selectedArticleAisle,
        isManual: true,
        checked: false
      });

      shoppingList.items.push(newItem);
      newItemLabel = '';
      selectedArticleId = null;
      selectedArticleAisle = null;
    } catch (err: any) {
      alert('Erreur : ' + err.message);
    } finally {
      
    }
  }

  // Commencer l'édition d'un item
  function startEditingItem(item: ShoppingListItem) {
    editingItemId = item.id;
    editQuantity = item.quantity?.toString() || '';
    editUnit = item.unit || '';
  }

  // Annuler l'édition
  function cancelEditingItem() {
    editingItemId = null;
    editQuantity = '';
    editUnit = '';
  }

  // Sauvegarder les modifications de quantité/unité
  async function saveItemQuantity(itemId: string) {
    if (!shoppingList) return;

    try {
      const quantity = editQuantity.trim() ? parseFloat(editQuantity.trim()) : null;
      const unit = editUnit.trim() || null;

      await apiService.updateShoppingListItem(itemId, {
        quantity: quantity,
        unit: unit
      });

      // Mettre à jour localement
      const index = shoppingList.items.findIndex(i => i.id === itemId);
      if (index !== -1) {
        shoppingList.items[index].quantity = quantity;
        shoppingList.items[index].unit = unit;
      }

      // Fermer l'édition
      cancelEditingItem();
    } catch (err: any) {
      alert('Erreur : ' + err.message);
    }
  }

  // Grouper les items par rayon
  let itemsByAisle = $derived(() => {
    if (!shoppingList) return new Map();

    const grouped = new Map<string, ShoppingListItem[]>();

    for (const item of shoppingList.items) {
      const aisle = item.aisle || 'NON_CLASSE';
      if (!grouped.has(aisle)) {
        grouped.set(aisle, []);
      }
      grouped.get(aisle)!.push(item);
    }

    return grouped;
  });


  function formatQuantity(item: ShoppingListItem): string {
    if (!item.quantity) return '';
    return `${item.quantity}${item.unit ? ' ' + item.unit : ''}`;
  }

  function goBack() {
    window.location.href = '/shopping-lists';
  }

  // Statistiques
  let stats = $derived(() => {
    if (!shoppingList) return { total: 0, checked: 0, percentage: 0 };

    const total = shoppingList.items.length;
    const checked = shoppingList.items.filter(i => i.checked).length;
    const percentage = total > 0 ? Math.round((checked / total) * 100) : 0;

    return { total, checked, percentage };
  });

  // Charger au montage
  $effect(() => {
    loadShoppingList();
  });
</script>

<Layout title={shoppingList?.name || 'Liste de courses'} currentPage="/shopping-lists" {user}>
  <div class="shopping-list-detail">
    {#if loading}
      <div class="loading-container">
        <div class="spinner"></div>
        <p>Chargement de la liste...</p>
      </div>
    {:else if error}
      <div class="error-container">
        <p class="error">{error}</p>
        <Button onclick={goBack}>Retour aux listes</Button>
      </div>
    {:else if shoppingList}
      <div class="header">
        <Button variant="secondary" onclick={goBack}>← Retour</Button>
        <div class="header-content">
          <h1>{shoppingList.name}</h1>
          {#if shoppingList.fromDate && shoppingList.toDate}
            <p class="date-range">
              {new Date(shoppingList.fromDate).toLocaleDateString('fr-FR')} - {new Date(shoppingList.toDate).toLocaleDateString('fr-FR')}
            </p>
          {/if}
        </div>
      </div>

      <div class="progress-section">
        <div class="progress-bar">
          <div class="progress-fill" style="width: {stats().percentage}%"></div>
        </div>
        <p class="progress-text">
          {stats().checked} / {stats().total} articles ({stats().percentage}%)
        </p>
      </div>

      <div class="add-item-section">
        <Button onclick={() => { showSelectArticleDrawer = true; }}>
          + Ajouter un article
        </Button>
      </div>

      <div class="items-container">
        {#each Array.from(itemsByAisle()) as [aisle, items]}
          <div class="aisle-section">
            <h2 class="aisle-title">{getAisleLabel(aisle)}</h2>
            <div class="items-list">
              {#each items as item}
                <div class="item-row" class:checked={item.checked}>
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onchange={() => toggleItem(item)}
                    class="item-checkbox"
                  />
                  <div class="item-content">
                    <span class="item-label">{item.label}</span>

                    {#if editingItemId === item.id}
                      <!-- Mode édition -->
                      <div class="item-edit-form">
                        <Input
                          id="edit-quantity-{item.id}"
                          type="number"
                          step="0.01"
                          placeholder="Quantité"
                          bind:value={editQuantity}
                          class="edit-quantity-input"
                        />
                        <Input
                          id="edit-unit-{item.id}"
                          placeholder="Unité (ex: kg, g, l)"
                          bind:value={editUnit}
                          class="edit-unit-input"
                        />
                        <div class="edit-actions">
                          <button
                            class="save-btn"
                            onclick={() => saveItemQuantity(item.id)}
                            title="Enregistrer"
                          >
                            ✓
                          </button>
                          <button
                            class="cancel-btn"
                            onclick={cancelEditingItem}
                            title="Annuler"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    {:else}
                      <!-- Mode affichage -->
                      <div class="item-quantity-display" onclick={() => startEditingItem(item)}>
                        {#if formatQuantity(item)}
                          <span class="item-quantity">{formatQuantity(item)}</span>
                        {:else}
                          <span class="item-quantity-empty">+ Ajouter quantité</span>
                        {/if}
                      </div>
                    {/if}

                    {#if item.note}
                      <p class="item-note">{item.note}</p>
                    {/if}
                  </div>
                  <button
                    class="delete-btn"
                    onclick={() => deleteItem(item.id)}
                    title="Supprimer"
                  >
                    🗑️
                  </button>
                </div>
              {/each}
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>

  <!-- Drawer pour créer un nouvel article -->
  <SelectArticleDrawer
    isOpen={showSelectArticleDrawer}
    onClose={() => { showSelectArticleDrawer = false; }}
    onArticleSelected={handleArticleSelected}
  />
</Layout>
<style lang="scss">
  .shopping-list-detail {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .loading-container,
  .error-container {
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

  .error {
    color: #c33;
  }

  .header {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .header-content {
      h1 {
        margin: 0;
        font-size: 2rem;
        color: var(--text-color);
      }

      .date-range {
        margin: 0.5rem 0 0 0;
        color: var(--text-secondary);
        font-size: 1rem;
      }
    }
  }

  .progress-section {
    .progress-bar {
      width: 100%;
      height: 12px;
      background: #e5e7eb;
      border-radius: 6px;
      overflow: hidden;

      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        transition: width 0.3s ease;
      }
    }

    .progress-text {
      margin: 0.5rem 0 0 0;
      text-align: center;
      color: var(--text-secondary);
      font-size: 0.95rem;
    }
  }

  .add-item-section {
    .add-item-form {
      display: flex;
      gap: 1rem;
      align-items: flex-start;

      :global(.article-autocomplete) {
        flex: 1;
      }
    }
  }

  .items-container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .aisle-section {
    .aisle-title {
      margin: 0 0 1rem 0;
      font-size: 1.3rem;
      color: var(--text-color);
      padding-bottom: 0.5rem;
      border-bottom: 2px solid var(--border-color);
    }

    .items-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
  }

  .item-row {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 1rem;
    background: white;
    border-radius: 8px;
    border: 1px solid var(--border-color);
    transition: all 0.2s ease;

    &:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    &.checked {
      opacity: 0.6;

      .item-label {
        text-decoration: line-through;
      }
    }

    .item-checkbox {
      flex-shrink: 0;
      width: 20px;
      height: 20px;
      margin-top: 2px;
      cursor: pointer;
    }

    .item-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;

      .item-label {
        font-size: 1rem;
        color: var(--text-color);
        font-weight: 500;
      }

      .item-quantity-display {
        cursor: pointer;
        padding: 0.25rem 0;
        transition: opacity 0.2s;

        &:hover {
          opacity: 0.7;
        }
      }

      .item-quantity {
        font-size: 0.9rem;
        color: var(--text-secondary);
        font-weight: 600;
      }

      .item-quantity-empty {
        font-size: 0.85rem;
        color: var(--text-tertiary);
        font-style: italic;
        opacity: 0.7;
      }

      .item-edit-form {
        display: flex;
        gap: 0.5rem;
        align-items: center;
        margin-top: 0.5rem;

        :global(.edit-quantity-input) {
          width: 80px;
        }

        :global(.edit-unit-input) {
          width: 120px;
        }

        .edit-actions {
          display: flex;
          gap: 0.25rem;

          button {
            background: none;
            border: none;
            cursor: pointer;
            font-size: 1.2rem;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            transition: background 0.2s;
          }

          .save-btn {
            color: #059669;

            &:hover {
              background: #d1fae5;
            }
          }

          .cancel-btn {
            color: #dc2626;

            &:hover {
              background: #fee2e2;
            }
          }
        }
      }

      .item-note {
        margin: 0;
        font-size: 0.85rem;
        color: var(--text-tertiary);
        font-style: italic;
      }
    }

    .delete-btn {
      flex-shrink: 0;
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.2rem;
      padding: 0.25rem;
      opacity: 0.6;
      transition: opacity 0.2s;

      &:hover {
        opacity: 1;
      }
    }
  }
</style>
