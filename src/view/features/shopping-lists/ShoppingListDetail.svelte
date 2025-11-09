<script lang="ts">
  import Layout from '../../layouts/Layout.svelte';
  import { Button, Input, ArticleAutocomplete, StoreAutocomplete, Select } from '../../components/ui';
  import { SelectArticleDrawer } from './components';
  import { StoreDrawer } from '../stores';
  import { apiService } from '../../services/api.service';
  import type { ShoppingList, ShoppingListItem } from '../../types/shopping-list.types';
  import { getAisleLabel } from '../../utils/aisle-labels';
  import { draggable, droppable, type DragDropState } from '@thisux/sveltednd';

  interface Store {
    id: string;
    name: string;
    logoUrl?: string | null;
    color?: string | null;
  }

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
  let editingStoreItemId = $state<string | null>(null);
  let editQuantity = $state('');
  let editUnit = $state('');
  let editStoreName = $state('');
  let showSelectArticleDrawer = $state(false);
  let showStoreDrawer = $state(false);
  let newStoreName = $state('');
  let currentEditingItemId = $state<string | null>(null);

  // Filtrage et groupement
  let groupBy = $state<'store' | 'aisle'>('store'); // Par défaut: grouper par enseigne
  let selectedStoreFilter = $state<string>('all'); // 'all' ou ID d'enseigne

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

  // Commencer l'édition de l'enseigne
  function startEditingStore(item: ShoppingListItem) {
    editingStoreItemId = item.id;
    editStoreName = item.store?.name || '';
  }

  // Annuler l'édition de l'enseigne
  function cancelEditingStore() {
    editingStoreItemId = null;
    editStoreName = '';
  }

  // Sauvegarder l'enseigne d'un item
  async function saveItemStore(itemId: string, store: Store | null) {
    if (!shoppingList) return;

    try {
      const updatedItem = await apiService.updateShoppingListItem(itemId, {
        storeId: store?.id || null
      });

      // Mettre à jour localement
      const index = shoppingList.items.findIndex(i => i.id === itemId);
      if (index !== -1) {
        shoppingList.items[index].storeId = updatedItem.storeId;
        shoppingList.items[index].store = updatedItem.store;
      }

      // Fermer l'édition
      cancelEditingStore();
    } catch (err: any) {
      alert('Erreur : ' + err.message);
    }
  }

  // Ouvrir le drawer pour créer une nouvelle enseigne
  function handleCreateNewStore(itemId: string, searchValue: string) {
    currentEditingItemId = itemId;
    newStoreName = searchValue;
    showStoreDrawer = true;
  }

  // Callback après création d'une nouvelle enseigne
  async function handleStoreCreated() {
    showStoreDrawer = false;

    // Recharger la liste pour récupérer les nouvelles données
    if (currentEditingItemId && newStoreName) {
      // Petit délai pour laisser la base de données se synchroniser
      await new Promise(resolve => setTimeout(resolve, 300));

      // Rechercher la nouvelle enseigne créée
      try {
        const result = await apiService.searchStores({
          search: newStoreName,
          limit: 1,
        });

        if (result.stores && result.stores.length > 0) {
          const newStore = result.stores[0];
          // Assigner automatiquement la nouvelle enseigne à l'item
          await saveItemStore(currentEditingItemId, newStore);

          // Recharger toute la liste de courses pour avoir les données à jour
          await loadShoppingList();
        } else {
          console.warn('Enseigne créée mais non trouvée:', newStoreName);
        }
      } catch (err) {
        console.error('Erreur lors de la récupération de la nouvelle enseigne:', err);
      }
    }

    currentEditingItemId = null;
    newStoreName = '';
  }

  function handleStoreDrawerClose() {
    showStoreDrawer = false;
    currentEditingItemId = null;
    newStoreName = '';
  }

  // État pour les animations de déplacement
  let flashingStore = $state<string | null>(null);

  // Drag and drop handlers
  async function handleDropOnAisle(state: DragDropState<ShoppingListItem>, targetStoreKey: string, targetAisleKey: string) {
    const { draggedItem } = state;
    if (!draggedItem || !shoppingList) return;

    // Determine the new store ID and aisle
    let newStoreId: string | null = null;
    let newAisle: string | null = null;

    // Decode store key
    if (targetStoreKey !== 'NO_STORE') {
      newStoreId = targetStoreKey;
    }

    // Decode aisle key
    if (targetAisleKey !== 'NON_CLASSE') {
      newAisle = targetAisleKey;
    }

    // Check if anything changed
    const currentStoreId = draggedItem.storeId || null;
    const currentAisle = draggedItem.aisle || null;

    if (currentStoreId === newStoreId && currentAisle === newAisle) {
      return; // No change needed
    }

    try {
      // Animation flash sur l'enseigne si changement d'enseigne
      if (currentStoreId !== newStoreId && targetStoreKey !== 'NO_STORE') {
        flashingStore = targetStoreKey;
        setTimeout(() => {
          flashingStore = null;
        }, 800);
      }

      // Update the item on the backend
      const updatedItem = await apiService.updateShoppingListItem(draggedItem.id, {
        storeId: newStoreId,
        aisle: newAisle
      });

      // Update locally
      const index = shoppingList.items.findIndex(i => i.id === draggedItem.id);
      if (index !== -1) {
        shoppingList.items[index].storeId = updatedItem.storeId;
        shoppingList.items[index].store = updatedItem.store;
        shoppingList.items[index].aisle = updatedItem.aisle;
      }
    } catch (err: any) {
      alert('Erreur lors du déplacement : ' + err.message);
    }
  }

  async function handleDropOnStore(state: DragDropState<ShoppingListItem>, targetStoreKey: string) {
    const { draggedItem } = state;
    if (!draggedItem || !shoppingList) return;

    // Determine the new store ID (keep the same aisle)
    let newStoreId: string | null = null;

    if (targetStoreKey !== 'NO_STORE') {
      newStoreId = targetStoreKey;
    }

    const currentStoreId = draggedItem.storeId || null;

    if (currentStoreId === newStoreId) {
      return; // No change needed
    }

    try {
      // Animation flash sur l'enseigne
      if (targetStoreKey !== 'NO_STORE') {
        flashingStore = targetStoreKey;
        setTimeout(() => {
          flashingStore = null;
        }, 800);
      }

      // Update the item on the backend
      const updatedItem = await apiService.updateShoppingListItem(draggedItem.id, {
        storeId: newStoreId
      });

      // Update locally
      const index = shoppingList.items.findIndex(i => i.id === draggedItem.id);
      if (index !== -1) {
        shoppingList.items[index].storeId = updatedItem.storeId;
        shoppingList.items[index].store = updatedItem.store;
      }
    } catch (err: any) {
      alert('Erreur lors du déplacement : ' + err.message);
    }
  }

  // Filtrer les items selon l'enseigne sélectionnée
  let filteredItems = $derived(() => {
    if (!shoppingList) return [];

    if (selectedStoreFilter === 'all') {
      return shoppingList.items;
    }

    return shoppingList.items.filter(item => {
      if (selectedStoreFilter === 'none') {
        return !item.storeId;
      }
      return item.storeId === selectedStoreFilter;
    });
  });

  // Grouper les items par enseigne puis par rayon
  let groupedItems = $derived(() => {
    const items = filteredItems();

    if (groupBy === 'aisle') {
      // Ancien comportement : grouper uniquement par rayon
      const grouped = new Map<string, { key: string; label: string; color?: string; items: ShoppingListItem[] }>();

      for (const item of items) {
        const groupKey = item.aisle || 'NON_CLASSE';
        const groupLabel = getAisleLabel(groupKey);

        if (!grouped.has(groupKey)) {
          grouped.set(groupKey, { key: groupKey, label: groupLabel, items: [] });
        }
        grouped.get(groupKey)!.items.push(item);
      }

      return grouped;
    } else {
      // Nouveau comportement : grouper par enseigne puis par rayon
      const storeGroups = new Map<string, {
        key: string;
        label: string;
        color?: string;
        aisles: Map<string, { key: string; label: string; items: ShoppingListItem[] }>;
      }>();

      for (const item of items) {
        // Premier niveau : enseigne
        let storeKey: string;
        let storeLabel: string;
        let storeColor: string | undefined;

        if (item.store) {
          storeKey = item.store.id;
          storeLabel = item.store.name;
          storeColor = item.store.color || undefined;
        } else {
          storeKey = 'NO_STORE';
          storeLabel = 'Sans enseigne';
        }

        if (!storeGroups.has(storeKey)) {
          storeGroups.set(storeKey, {
            key: storeKey,
            label: storeLabel,
            color: storeColor,
            aisles: new Map()
          });
        }

        // Deuxième niveau : rayon
        const storeGroup = storeGroups.get(storeKey)!;
        const aisleKey = item.aisle || 'NON_CLASSE';
        const aisleLabel = getAisleLabel(aisleKey);

        if (!storeGroup.aisles.has(aisleKey)) {
          storeGroup.aisles.set(aisleKey, {
            key: aisleKey,
            label: aisleLabel,
            items: []
          });
        }

        storeGroup.aisles.get(aisleKey)!.items.push(item);
      }

      // Trier les enseignes : ordre alphabétique, "Sans enseigne" à la fin
      const sortedStoreGroups = new Map(
        Array.from(storeGroups.entries()).sort(([keyA, groupA], [keyB, groupB]) => {
          // "Sans enseigne" toujours en dernier
          if (keyA === 'NO_STORE') return 1;
          if (keyB === 'NO_STORE') return -1;

          // Sinon, tri alphabétique par label
          return groupA.label.localeCompare(groupB.label, 'fr');
        })
      );

      return sortedStoreGroups;
    }
  });

  // Liste des enseignes disponibles pour le filtre
  let availableStores = $derived(() => {
    if (!shoppingList) return [];

    const storesMap = new Map<string, Store>();
    for (const item of shoppingList.items) {
      if (item.store) {
        storesMap.set(item.store.id, item.store);
      }
    }

    return Array.from(storesMap.values());
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

      <!-- Filtres et options d'affichage -->
      <div class="filters-section">
        <Select
          id="groupBy"
          label="Grouper par:"
          bind:value={groupBy}
          options={[
            { value: 'store', label: '🏪 Enseigne' },
            { value: 'aisle', label: '📦 Rayon' }
          ]}
        />

        {#if groupBy === 'store'}
          <Select
            id="storeFilter"
            label="Filtrer par enseigne:"
            bind:value={selectedStoreFilter}
            options={[
              { value: 'all', label: 'Toutes les enseignes' },
              { value: 'none', label: 'Sans enseigne' },
              ...availableStores().map(store => ({ value: store.id, label: store.name }))
            ]}
          />
        {/if}
      </div>

      <div class="items-container">
        {#if groupBy === 'aisle'}
          <!-- Groupement simple par rayon -->
          {#each Array.from(groupedItems()) as [groupKey, group]}
            <div class="group-section">
              <h2 class="group-title">{group.label}</h2>
              <div
                class="items-list"
                use:droppable={{
                  container: `aisle-${groupKey}`,
                  callbacks: {
                    onDrop: (state) => handleDropOnAisle(state, 'NO_STORE', groupKey)
                  }
                }}
              >
                {#each group.items as item}
                  <div
                    class="item-row"
                    class:checked={item.checked}
                  >
                    <div
                      class="drag-handle"
                      title="Glisser pour déplacer"
                      use:draggable={{
                        container: `aisle-${groupKey}`,
                        dragData: item
                      }}
                    >
                      ⋮⋮
                    </div>
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
                            >
                              ✓
                            </button>
                            <button
                              class="cancel-btn"
                              onclick={cancelEditingItem}
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
                            <span class="item-quantity-empty">+ Quantité</span>
                          {/if}
                        </div>
                      {/if}

                      <!-- Affichage et édition de l'enseigne -->
                      {#if editingStoreItemId === item.id}
                        <div class="item-store-edit">
                          <StoreAutocomplete
                            id="edit-store-{item.id}"
                            bind:value={editStoreName}
                            onSelect={(store) => saveItemStore(item.id, store)}
                            onCreateNew={(searchValue) => handleCreateNewStore(item.id, searchValue)}
                            placeholder="Choisir une enseigne..."
                          />
                          <button
                            class="cancel-btn-small"
                            onclick={cancelEditingStore}
                            title="Annuler"
                          >
                            ✕
                          </button>
                        </div>
                      {:else}
                        <div class="item-store-display" onclick={() => startEditingStore(item)}>
                          {#if item.store}
                            <span class="item-store">🏪 {item.store.name}</span>
                          {:else}
                            <span class="item-store-empty">+ Enseigne</span>
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
        {:else}
          <!-- Groupement double niveau : enseigne → rayon -->
          {#each Array.from(groupedItems()) as [storeKey, storeGroup]}
            <div
              class="store-group"
              class:store-group--flashing={flashingStore === storeKey}
              style="{storeGroup.color ? `border-left: 4px solid ${storeGroup.color};` : ''}"
              use:droppable={{
                container: `store-${storeKey}`,
                callbacks: {
                  onDrop: (state) => handleDropOnStore(state, storeKey)
                }
              }}
            >
              <h2 class="store-title">{storeGroup.label}</h2>

              {#each Array.from(storeGroup.aisles) as [aisleKey, aisleGroup]}
                <div class="aisle-subgroup">
                  <h3 class="aisle-subtitle">{aisleGroup.label}</h3>
                  <div
                    class="items-list"
                    use:droppable={{
                      container: `store-${storeKey}-aisle-${aisleKey}`,
                      callbacks: {
                        onDrop: (state) => handleDropOnAisle(state, storeKey, aisleKey)
                      }
                    }}
                  >
                    {#each aisleGroup.items as item}
                <div
                  class="item-row"
                  class:checked={item.checked}
                >
                  <div
                    class="drag-handle"
                    title="Glisser pour déplacer"
                    use:draggable={{
                      container: `store-${storeKey}-aisle-${aisleKey}`,
                      dragData: item
                    }}
                  >
                    ⋮⋮
                  </div>
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

                    <!-- Affichage et édition de l'enseigne -->
                    {#if editingStoreItemId === item.id}
                      <div class="item-store-edit">
                        <StoreAutocomplete
                          id="edit-store-{item.id}"
                          bind:value={editStoreName}
                          onSelect={(store) => saveItemStore(item.id, store)}
                          onCreateNew={(searchValue) => handleCreateNewStore(item.id, searchValue)}
                          placeholder="Choisir une enseigne..."
                        />
                        <button
                          class="cancel-btn-small"
                          onclick={cancelEditingStore}
                          title="Annuler"
                        >
                          ✕
                        </button>
                      </div>
                    {:else}
                      <div class="item-store-display" onclick={() => startEditingStore(item)}>
                        {#if item.store}
                          <span class="item-store">🏪 {item.store.name}</span>
                        {:else}
                          <span class="item-store-empty">+ Enseigne</span>
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
          {/each}
        {/if}
      </div>
    {/if}
  </div>

  <!-- Drawer pour créer un nouvel article -->
  <SelectArticleDrawer
    isOpen={showSelectArticleDrawer}
    onClose={() => { showSelectArticleDrawer = false; }}
    onArticleSelected={handleArticleSelected}
  />

  <!-- Drawer pour créer une nouvelle enseigne -->
  <StoreDrawer
    isOpen={showStoreDrawer}
    store={null}
    initialName={newStoreName}
    onSave={handleStoreCreated}
    onClose={handleStoreDrawerClose}
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

  .filters-section {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    padding: 1rem;
    background: #f9fafb;
    border-radius: 8px;

    .filter-group {
      display: flex;
      align-items: center;
      gap: 0.5rem;

      label {
        font-weight: 600;
        color: #333;
        font-size: 0.95rem;
      }

      .filter-select {
        padding: 0.5rem 1rem;
        border: 2px solid #e0e0e0;
        border-radius: 6px;
        font-size: 0.95rem;
        cursor: pointer;

        &:focus {
          outline: none;
          border-color: #667eea;
        }
      }
    }
  }

  .group-section {
    padding-left: 0.5rem;

    .group-title {
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
      min-height: 60px;
      transition: all 0.2s ease;
      border-radius: 6px;
      padding: 0.25rem;

      // Drop zone visual feedback
      &[data-drop-target="true"] {
        background: rgba(102, 126, 234, 0.1);
        border: 2px dashed #667eea;
        padding: 0.5rem;
      }
    }
  }

  .store-group {
    padding-left: 0.5rem;
    margin-bottom: 2rem;
    transition: all 0.2s ease;

    // Drop zone visual feedback
    &[data-drop-target="true"] {
      background: rgba(102, 126, 234, 0.05);
      border-left-width: 6px;
      padding: 0.5rem;
      border-radius: 8px;
    }

    // Animation flash quand un article est déposé
    &--flashing {
      animation: storeFlash 0.8s ease-out;

      .store-title {
        animation: storeTitlePulse 0.8s ease-out;
      }
    }

    .store-title {
      margin: 0 0 1.5rem 0;
      font-size: 1.5rem;
      color: var(--text-color);
      padding-bottom: 0.75rem;
      border-bottom: 3px solid var(--border-color);
      font-weight: 700;
      transition: all 0.3s ease;
    }

    .aisle-subgroup {
      margin-bottom: 1.5rem;

      .aisle-subtitle {
        margin: 0 0 0.75rem 0;
        font-size: 1.1rem;
        color: var(--text-secondary);
        padding-bottom: 0.5rem;
        padding-left: 0.5rem;
        border-bottom: 1px solid var(--border-color);
        font-weight: 600;
      }

      .items-list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        padding-left: 1rem;
        min-height: 60px;
        transition: all 0.2s ease;
        border-radius: 6px;

        // Drop zone visual feedback for aisle subgroups
        &[data-drop-target="true"] {
          background: rgba(102, 126, 234, 0.1);
          border: 2px dashed #667eea;
          padding: 0.5rem;
        }
      }
    }
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

    // Drag states - appliqué quand le handle est draggé
    &:has(.drag-handle[data-dragging="true"]) {
      opacity: 0.5;
      transform: scale(0.95);
    }

    .drag-handle {
      flex-shrink: 0;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #9ca3af;
      font-size: 1rem;
      cursor: grab;
      user-select: none;
      transition: all 0.2s ease;

      &:hover {
        color: #667eea;
        transform: scale(1.1);
      }

      &:active {
        cursor: grabbing;
      }

      // État pendant le drag
      &[data-dragging="true"] {
        cursor: grabbing;
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

      .item-store-display {
        cursor: pointer;
        padding: 0.25rem 0;
        transition: opacity 0.2s;

        &:hover {
          opacity: 0.7;
        }
      }

      .item-store {
        font-size: 0.85rem;
        color: #667eea;
        font-weight: 600;
      }

      .item-store-empty {
        font-size: 0.85rem;
        color: var(--text-tertiary);
        font-style: italic;
        opacity: 0.7;
      }

      .item-store-edit {
        display: flex;
        gap: 0.5rem;
        align-items: center;
        margin-top: 0.5rem;

        :global(.store-autocomplete) {
          flex: 1;
        }

        .cancel-btn-small {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1.2rem;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          color: #dc2626;
          transition: background 0.2s;

          &:hover {
            background: #fee2e2;
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

  // Animations pour le feedback de déplacement d'article
  @keyframes storeFlash {
    0% {
      background: rgba(102, 126, 234, 0.15);
      transform: scale(1);
    }
    50% {
      background: rgba(102, 126, 234, 0.25);
      transform: scale(1.01);
      box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
    }
    100% {
      background: transparent;
      transform: scale(1);
      box-shadow: none;
    }
  }

  @keyframes storeTitlePulse {
    0% {
      transform: scale(1);
      color: var(--text-color);
    }
    50% {
      transform: scale(1.05);
      color: #667eea;
    }
    100% {
      transform: scale(1);
      color: var(--text-color);
    }
  }
</style>
