<script lang="ts">
  import { onMount } from 'svelte';
  import Layout from '../../layouts/Layout.svelte';
  import { Button, IconButton, Input, ArticleAutocomplete, StoreAutocomplete, ProgressBar, Dot, ConfirmModal, Breadcrumb, PageHero, FilterGroup, ListItem } from '../../components/ui';
  import { SelectArticleDrawer } from './components';
  import { StoreDrawer } from '../stores';
  import { apiService } from '../../services/api.service';
  import type { ShoppingList, ShoppingListItem } from '../../types/shopping-list.types';
  import { getAisleLabel } from '../../utils/aisle-labels';
  import { StoreAisleColors } from '../../types/ingredient.types';
  import { getBadgeColor } from '../../helpers/color.helper';
  import { draggable, droppable, type DragDropState, dndState } from '@thisux/sveltednd';
  import { Check, X, Pencil, GripVertical, Printer } from 'lucide-svelte';

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

  // Modal de confirmation de suppression
  let isConfirmModalOpen = $state(false);
  let itemToDelete = $state<string | null>(null);
  let deleteError = $state<string>('');

  // Gestion centralisée des erreurs
  let globalError = $state<string>('');

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
      globalError = err.message || 'Une erreur est survenue';
    }
  }

  // Supprimer un item
  function openDeleteConfirmation(itemId: string) {
    itemToDelete = itemId;
    isConfirmModalOpen = true;
    deleteError = '';
  }

  function cancelDelete() {
    itemToDelete = null;
    isConfirmModalOpen = false;
    deleteError = '';
  }

  function handlePrint() {
    window.print();
  }

  async function confirmDelete() {
    if (!itemToDelete) return;

    try {
      await apiService.deleteShoppingListItem(itemToDelete);

      // Retirer localement
      if (shoppingList) {
        shoppingList.items = shoppingList.items.filter(i => i.id !== itemToDelete);
      }
      isConfirmModalOpen = false;
      itemToDelete = null;
      deleteError = '';
    } catch (err: any) {
      deleteError = err.message || 'Erreur lors de la suppression';
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
      globalError = err.message || 'Une erreur est survenue';
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
      globalError = err.message || 'Une erreur est survenue';
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
      globalError = err.message || 'Une erreur est survenue';
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
      globalError = err.message || 'Une erreur est survenue';
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

  // Auto-scroll pendant le drag
  let currentMouseY = $state(0);
  let autoScrollInterval: ReturnType<typeof setInterval> | null = null;

  function performScroll(mouseY: number) {
    const scrollZone = 100; // Zone de 100px en haut et en bas
    const maxScrollSpeed = 15;
    const viewportHeight = window.innerHeight;

    // Curseur dans la zone haute
    if (mouseY >= 0 && mouseY < scrollZone) {
      const intensity = 1 - (mouseY / scrollZone);
      const scrollAmount = Math.ceil(maxScrollSpeed * intensity);
      window.scrollBy({ top: -scrollAmount, behavior: 'auto' });
    }
    // Curseur dans la zone basse
    else if (mouseY > viewportHeight - scrollZone && mouseY <= viewportHeight) {
      const intensity = (mouseY - (viewportHeight - scrollZone)) / scrollZone;
      const scrollAmount = Math.ceil(maxScrollSpeed * intensity);
      window.scrollBy({ top: scrollAmount, behavior: 'auto' });
    }
  }

  function handleMouseMove(e: MouseEvent) {
    currentMouseY = e.clientY;
  }

  // Écouter les changements de drag state
  $effect(() => {
    const isDragging = dndState.draggedItem !== null;

    if (isDragging) {
      // Démarrer le listener de souris et l'auto-scroll
      window.addEventListener('mousemove', handleMouseMove, true);

      if (!autoScrollInterval) {
        autoScrollInterval = setInterval(() => {
          performScroll(currentMouseY);
        }, 16); // ~60fps
      }
    } else {
      // Arrêter tout
      window.removeEventListener('mousemove', handleMouseMove, true);

      if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
        autoScrollInterval = null;
      }
    }

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove, true);
      if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
        autoScrollInterval = null;
      }
    };
  });

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
      globalError = err.message || 'Erreur lors du déplacement';
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
      globalError = err.message || 'Erreur lors du déplacement';
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
      <Breadcrumb
        backLabel="Listes de courses"
        backHref="/shopping-lists"
      />

      <PageHero
        title={shoppingList.name}
        subtitle={shoppingList.fromDate && shoppingList.toDate
          ? `${new Date(shoppingList.fromDate).toLocaleDateString('fr-FR')} - ${new Date(shoppingList.toDate).toLocaleDateString('fr-FR')}`
          : undefined}
        actionLabel="+ Ajouter un article"
        onAction={() => { showSelectArticleDrawer = true; }}
      >
        {#snippet progress()}
          <ProgressBar
            value={stats().checked}
            max={stats().total}
            size="medium"
            variant="success"
            showLabel={true}
            label="{stats().checked} / {stats().total} articles"
            inverse={true}
          />
        {/snippet}

        {#snippet filters()}
          <FilterGroup
            label="Grouper par"
            bind:value={groupBy}
            options={[
              { value: 'store', label: 'Enseigne' },
              { value: 'aisle', label: 'Rayon' }
            ]}
            inverse={true}
          />

          {#if groupBy === 'store'}
            <FilterGroup
              label="Filtrer par enseigne"
              bind:value={selectedStoreFilter}
              options={[
                { value: 'all', label: 'Toutes les enseignes' },
                { value: 'none', label: 'Sans enseigne' },
                ...availableStores().map(store => ({ value: store.id, label: store.name }))
              ]}
              inverse={true}
            />
          {/if}
        {/snippet}
      </PageHero>

      <div class="print-button-container no-print">
        <Button onclick={handlePrint} variant="secondary-full" size="medium">
          <Printer size={18} /> Imprimer
        </Button>
      </div>

      {#if globalError}
        <div class="error-banner">
          <span>{globalError}</span>
          <button onclick={() => { globalError = ''; }}>✕</button>
        </div>
      {/if}

      <div class="items-container">
        {#if groupBy === 'aisle'}
          <!-- Groupement simple par rayon -->
          {#each Array.from(groupedItems()) as [groupKey, group]}
            <div class="group-section">
              <h2 class="group-title">{group.label}</h2>
              <div
                class="items-grid"
                use:droppable={{
                  container: `aisle-${groupKey}`,
                  callbacks: {
                    onDrop: (state) => handleDropOnAisle(state, 'NO_STORE', groupKey)
                  }
                }}
              >
                {#each group.items as item}
                  <ListItem
                    title={item.label}
                    draggable={true}
                    checkable={true}
                    checked={item.checked}
                    onCheck={() => toggleItem(item)}
                    onDelete={() => openDeleteConfirmation(item.id)}
                    showThumbnail={false}
                  >
                    {#snippet dragHandleSlot()}
                      <div
                        use:draggable={{
                          container: `aisle-${groupKey}`,
                          dragData: item
                        }}
                        class="drag-handle"
                        title="Glisser pour déplacer"
                      >
                        <GripVertical size={20} />
                      </div>
                    {/snippet}

                    {#snippet children()}
                      <h3 class="item-label">{item.label}</h3>

                      {#if editingItemId === item.id}
                        <!-- Mode édition quantité -->
                        <div class="item-edit-form">
                          <Input
                            id="edit-quantity-{item.id}"
                            type="number"
                            step="0.01"
                            placeholder="Quantité"
                            bind:value={editQuantity}
                          />
                          <Input
                            id="edit-unit-{item.id}"
                            placeholder="Unité (ex: kg, g, l)"
                            bind:value={editUnit}
                          />
                          <div class="edit-actions">
                            <IconButton
                              onclick={() => saveItemQuantity(item.id)}
                              size="small"
                              variant="success"
                              ariaLabel="Enregistrer"
                            >
                              <Check size={16} />
                            </IconButton>
                            <IconButton
                              onclick={cancelEditingItem}
                              size="small"
                              variant="ghost"
                              ariaLabel="Annuler"
                            >
                              <X size={16} />
                            </IconButton>
                          </div>
                        </div>
                      {:else}
                        <!-- Mode affichage quantité -->
                        <div class="item-quantity-display" onclick={() => startEditingItem(item)}>
                          {#if formatQuantity(item)}
                            <span class="item-quantity">{formatQuantity(item)}</span>
                          {:else}
                            <span class="item-quantity-empty">+ Quantité</span>
                          {/if}
                          <Pencil size={12} class="edit-icon" />
                        </div>
                      {/if}

                      {#if item.note}
                        <p class="item-note">{item.note}</p>
                      {/if}
                    {/snippet}

                    {#snippet footer()}
                      <div class="item-footer">
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
                            <IconButton
                              onclick={cancelEditingStore}
                              size="small"
                              variant="ghost"
                              ariaLabel="Annuler"
                            >
                              <X size={16} />
                            </IconButton>
                          </div>
                        {:else}
                          <div class="item-store-display" onclick={() => startEditingStore(item)}>
                            {#if item.store}
                              <span class="item-store">{item.store.name}</span>
                            {:else}
                              <span class="item-store-empty">+ Enseigne</span>
                            {/if}
                            <Pencil size={12} class="edit-icon" />
                          </div>
                        {/if}
                      </div>
                    {/snippet}
                  </ListItem>
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
                  <h3 class="aisle-subtitle">
                    {#if aisleKey !== 'NON_CLASSE'}
                      <Dot color={getBadgeColor(StoreAisleColors[aisleKey])} size="small" />
                    {/if}
                    {aisleGroup.label}
                  </h3>
                  <div
                    class="items-grid"
                    use:droppable={{
                      container: `store-${storeKey}-aisle-${aisleKey}`,
                      callbacks: {
                        onDrop: (state) => handleDropOnAisle(state, storeKey, aisleKey)
                      }
                    }}
                  >
                    {#each aisleGroup.items as item}
                      <ListItem
                        title={item.label}
                        draggable={true}
                        checkable={true}
                        checked={item.checked}
                        onCheck={() => toggleItem(item)}
                        onDelete={() => openDeleteConfirmation(item.id)}
                        showThumbnail={false}
                      >
                        {#snippet dragHandleSlot()}
                          <div
                            use:draggable={{
                              container: `store-${storeKey}-aisle-${aisleKey}`,
                              dragData: item
                            }}
                            class="drag-handle"
                            title="Glisser pour déplacer"
                          >
                            <GripVertical size={20} />
                          </div>
                        {/snippet}

                        {#snippet children()}
                          <h3 class="item-label">{item.label}</h3>

                          {#if editingItemId === item.id}
                            <!-- Mode édition quantité -->
                            <div class="item-edit-form">
                              <Input
                                id="edit-quantity-{item.id}"
                                type="number"
                                step="0.01"
                                placeholder="Quantité"
                                bind:value={editQuantity}
                              />
                              <Input
                                id="edit-unit-{item.id}"
                                placeholder="Unité (ex: kg, g, l)"
                                bind:value={editUnit}
                              />
                              <div class="edit-actions">
                                <IconButton
                                  onclick={() => saveItemQuantity(item.id)}
                                  size="small"
                                  variant="success"
                                  ariaLabel="Enregistrer"
                                >
                                  <Check size={16} />
                                </IconButton>
                                <IconButton
                                  onclick={cancelEditingItem}
                                  size="small"
                                  variant="ghost"
                                  ariaLabel="Annuler"
                                >
                                  <X size={16} />
                                </IconButton>
                              </div>
                            </div>
                          {:else}
                            <!-- Mode affichage quantité -->
                            <div class="item-quantity-display" onclick={() => startEditingItem(item)}>
                              {#if formatQuantity(item)}
                                <span class="item-quantity">{formatQuantity(item)}</span>
                              {:else}
                                <span class="item-quantity-empty">+ Quantité</span>
                              {/if}
                              <Pencil size={12} class="edit-icon" />
                            </div>
                          {/if}

                          {#if item.note}
                            <p class="item-note">{item.note}</p>
                          {/if}
                        {/snippet}

                        {#snippet footer()}
                          <div class="item-footer">
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
                                <IconButton
                                  onclick={cancelEditingStore}
                                  size="small"
                                  variant="ghost"
                                  ariaLabel="Annuler"
                                >
                                  <X size={16} />
                                </IconButton>
                              </div>
                            {:else}
                              <div class="item-store-display" onclick={() => startEditingStore(item)}>
                                {#if item.store}
                                  <span class="item-store">{item.store.name}</span>
                                {:else}
                                  <span class="item-store-empty">+ Enseigne</span>
                                {/if}
                                <Pencil size={12} class="edit-icon" />
                              </div>
                            {/if}
                          </div>
                        {/snippet}
                      </ListItem>
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

<!-- Modal de confirmation de suppression -->
<ConfirmModal
  isOpen={isConfirmModalOpen}
  title="Supprimer l'article"
  message={deleteError || "Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible."}
  confirmLabel="Supprimer"
  cancelLabel="Annuler"
  onConfirm={confirmDelete}
  onCancel={cancelDelete}
  variant={deleteError ? 'danger' : 'warning'}
/>

<style lang="scss">
  @use '../../styles/variables' as *;

  .shopping-list-detail {
    display: flex;
    flex-direction: column;
    gap: $spacing-lg;
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
    color: $color-danger-dark;
  }


  .error-banner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: $color-background-danger;
    border: 2px solid $color-danger;
    border-radius: 8px;
    color: $color-danger;
    margin: 1rem 0;
    font-weight: 500;

    button {
      background: none;
      border: none;
      color: $color-danger;
      cursor: pointer;
      font-size: 1.2rem;
      padding: 0 0.5rem;
      line-height: 1;

      &:hover {
        opacity: 0.7;
      }
    }
  }

  .items-container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
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

    .items-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: $spacing-base;
      min-height: 60px;
      transition: all 0.2s ease;
      border-radius: 6px;
      padding: 0.25rem;

      @media (min-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
      }

      @media (min-width: 1024px) {
        grid-template-columns: repeat(3, 1fr);
      }

      // Drop zone visual feedback
      &[data-drop-target="true"] {
        background: rgba($brand-primary, 0.1);
        border: 2px dashed $brand-primary;
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
      background: rgba($brand-primary, 0.05);
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
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .items-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: $spacing-base;
        padding-left: 1rem;
        min-height: 60px;
        transition: all 0.2s ease;
        border-radius: 6px;

        @media (min-width: 768px) {
          grid-template-columns: repeat(2, 1fr);
        }

        @media (min-width: 1024px) {
          grid-template-columns: repeat(3, 1fr);
        }

        // Drop zone visual feedback for aisle subgroups
        &[data-drop-target="true"] {
          background: rgba($brand-primary, 0.1);
          border: 2px dashed $brand-primary;
          padding: 0.5rem;
        }
      }
    }
  }

  // Styles for item content (inside ListItem children snippet)
  .drag-handle {
    cursor: grab;
    color: $color-text-tertiary;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s;

    &:hover {
      color: $brand-primary;
    }

    &:active {
      cursor: grabbing;
    }

    :global(svg) {
      flex-shrink: 0;
    }
  }

  .item-label {
    margin: 0;
    font-size: $font-size-base;
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
  }

  .item-quantity-display {
    cursor: pointer;
    padding: 0.25rem 0;
    transition: opacity 0.2s;
    display: flex;
    align-items: center;
    gap: $spacing-xs;

    &:hover {
      opacity: 0.7;
    }

    :global(.edit-icon) {
      color: $color-text-tertiary;
      opacity: 0.5;
      flex-shrink: 0;
      transition: opacity 0.2s;
      align-self: flex-start;
      margin-top: -2px;
    }

    &:hover :global(.edit-icon) {
      opacity: 0.8;
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
    flex-wrap: wrap;

    .edit-actions {
      display: flex;
      gap: 0.25rem;
      margin-left: auto;
    }
  }

  .item-store-display {
    cursor: pointer;
    padding: 0.25rem 0;
    transition: opacity 0.2s;
    display: flex;
    align-items: center;
    gap: $spacing-xs;

    &:hover {
      opacity: 0.7;
    }

    :global(.edit-icon) {
      color: $color-text-tertiary;
      opacity: 0.5;
      flex-shrink: 0;
      transition: opacity 0.2s;
      align-self: flex-start;
      margin-top: -2px;
    }

    &:hover :global(.edit-icon) {
      opacity: 0.8;
    }
  }

  .item-store {
    font-size: 0.85rem;
    color: $brand-primary;
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
  }

  .item-note {
    margin: 0;
    font-size: 0.85rem;
    color: var(--text-tertiary);
    font-style: italic;
  }

  .item-footer {
    display: flex;
    align-items: center;
    width: 100%;
  }

  // Animations pour le feedback de déplacement d'article
  @keyframes storeFlash {
    0% {
      background: rgba($brand-primary, 0.15);
      transform: scale(1);
    }
    50% {
      background: rgba($brand-primary, 0.25);
      transform: scale(1.01);
      box-shadow: 0 4px 20px rgba($brand-primary, 0.3);
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
      color: $brand-primary;
    }
    100% {
      transform: scale(1);
      color: var(--text-color);
    }
  }

  .print-button-container {
    display: flex;
    justify-content: flex-end;
    margin-bottom: $spacing-md;
  }

  // Styles d'impression
  @media print {
    // Masquer les éléments non nécessaires
    :global(.layout__footer),
    :global(header),
    :global(nav),
    .error-banner,
    :global(.breadcrumb),
    :global(.page-hero__actions),
    :global(.page-hero__filters),
    :global(.page-hero__controls),
    :global(.page-hero__progress),
    :global(.list-item__actions),
    .drag-handle,
    :global(.list-item__checkbox),
    :global(.edit-icon),
    .edit-icon,
    .item-store-display,
    .item-quantity-display :global(.edit-icon),
    .no-print {
      display: none !important;
    }

    // Réinitialiser les marges et padding
    .shopping-list-detail {
      padding: 0;
      background: white;
    }

    // Simplifier le Hero pour l'impression
    :global(.hero) {
      padding: 0 !important;
      margin: 0 !important;
      background: white !important;
      box-shadow: none !important;
    }

    :global(.hero__overlay) {
      display: none !important;
    }

    :global(.page-hero) {
      padding: 0 !important;
      margin: 0 !important;
    }

    :global(.page-hero__header) {
      margin: 0 0 6pt 0 !important;
      padding: 0 !important;
    }

    // Titre de la liste - sans ombre, simple
    :global(.page-hero__title),
    :global(.title) {
      font-size: 16pt !important;
      margin: 0 0 2pt 0 !important;
      padding: 0 !important;
      color: black !important;
      text-shadow: none !important;
      text-transform: none !important;
      font-weight: bold !important;
    }

    :global(.page-hero__subtitle) {
      font-size: 9pt !important;
      margin: 0 0 6pt 0 !important;
      padding: 0 !important;
      color: #666 !important;
    }

    // Groupes compacts avec break control
    .aisle-group,
    .store-group {
      page-break-inside: auto;
      margin: 0 0 4pt 0 !important;
      padding: 0 !important;
      border: none !important;
    }

    .aisle-title,
    .store-title {
      font-size: 10pt;
      font-weight: bold;
      margin: 0 0 2pt 0 !important;
      padding: 0 0 1pt 0 !important;
      border-bottom: 1px solid #999;
      color: black !important;
      page-break-after: avoid !important;
    }

    // Répéter le nom de l'enseigne sur chaque page
    .store-group {
      page-break-before: auto;
    }

    .store-title {
      page-break-after: avoid !important;
      position: relative;
    }

    .store-title::after {
      content: '';
      display: block;
      page-break-inside: avoid;
    }

    // Forcer l'affichage du titre d'enseigne en haut de chaque nouvelle page
    @supports (break-before: page) {
      .store-group {
        break-inside: auto;
      }

      .store-title {
        break-after: avoid;
        display: table-header-group;
      }
    }

    .aisle-subtitle {
      font-size: 8pt;
      font-weight: bold;
      margin: 2pt 0 4pt 0 !important;
      padding: 0 0 2pt 0 !important;
      color: black !important;
    }

    .aisle-subgroup {
      margin: 0 0 4pt 0 !important;
      padding: 0 !important;
    }

    // Grille d'items en liste simple
    .items-grid {
      display: block !important;
      grid-template-columns: none !important;
      padding: 0 !important;
      margin: 0 !important;
      gap: 0 !important;
    }

    .items-grid > :global(.list-item:not(:last-child)) {
      margin-bottom: 0pt !important;
    }

    // Items très compacts alignés à gauche - tout sur une ligne
    :global(.list-item) {
      page-break-inside: avoid;
      border: none !important;
      box-shadow: none !important;
      padding: 0 !important;
      margin: 0 !important;
      background: transparent !important;
      display: block !important;
      line-height: 1.2 !important;
    }

    :global(.list-item__main) {
      padding: 0 !important;
      margin: 0 !important;
      gap: 3pt !important;
      display: flex !important;
      flex-direction: row !important;
      align-items: baseline !important;
    }

    :global(.list-item__content) {
      gap: 3pt !important;
      margin: 0 !important;
      padding: 0 !important;
      flex: 1 !important;
      display: flex !important;
      flex-direction: row !important;
      align-items: baseline !important;
      flex-wrap: wrap !important;
    }

    :global(.list-item--checked) {
      opacity: 0.4 !important;
      text-decoration: line-through !important;
    }

    .item-label {
      font-size: 9pt !important;
      color: black;
      margin: 0 !important;
      line-height: 1.2 !important;
      flex-shrink: 0 !important;
    }

    .item-quantity-display {
      font-size: 8pt !important;
      color: #555 !important;
      padding: 0 !important;
      margin: 0 !important;
      flex-shrink: 0 !important;
    }

    .item-quantity {
      font-size: 8pt !important;
      color: #555 !important;
    }

    .item-quantity-empty {
      display: none !important;
    }

    .item-store-display {
      display: none !important;
    }

    .item-note {
      font-size: 7pt !important;
      color: #888 !important;
      font-style: italic;
      margin: 0 !important;
      flex-basis: 100% !important;
    }

    // Cases à cocher compactes
    :global(.list-item__main)::before {
      content: '☐';
      font-size: 10pt;
      margin-right: 3pt;
      flex-shrink: 0;
      line-height: 1.2;
    }

    :global(.list-item--checked .list-item__main)::before {
      content: '☑';
    }

    // Footer compact
    .item-footer {
      border-top: none !important;
      padding: 0 !important;
      margin-top: 1pt !important;
    }
  }
</style>
