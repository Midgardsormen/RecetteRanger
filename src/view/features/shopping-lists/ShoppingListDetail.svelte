<script lang="ts">
  import { onMount } from 'svelte';
  import Layout from '../../layouts/Layout.svelte';
  import { Button, IconButton, Input, ArticleAutocomplete, StoreAutocomplete, ProgressBar, Dot, ConfirmModal, Breadcrumb, PageHero, FilterGroup, ListItem } from '../../components/ui';
  import { SelectArticleDrawer } from './components';
  import { StoreDrawer } from '../stores';
  import type { ShoppingList, ShoppingListItem } from '../../types/shopping-list.types';
  import { StoreAisleColors } from '../../types/ingredient.types';
  import { getBadgeColor } from '../../helpers/color.helper';
  import { draggable, droppable, type DragDropState, dndState } from '@thisux/sveltednd';
  import { Check, X, Pencil, GripVertical, Printer } from 'lucide-svelte';

  // Import actions, config, and helpers
  import * as actions from './shopping-list-detail.actions';
  import { AUTO_SCROLL_CONFIG, ANIMATION_CONFIG } from './shopping-list-detail.config';
  import {
    formatQuantity,
    filterItemsByStore,
    groupItemsByAisle,
    groupItemsByStoreAndAisle,
    getAvailableStores,
    calculateStats
  } from './shopping-list.helpers';

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
      const list = await actions.loadShoppingList(listId);
      shoppingList = list;
    } catch (err: any) {
      error = err.message || 'Erreur lors du chargement de la liste';
    } finally {
      loading = false;
    }
  }

  // Cocher/décocher un item
  async function toggleItem(item: ShoppingListItem) {
    if (!shoppingList) return;
    try {
      await actions.toggleItem(item, shoppingList);
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
    if (!itemToDelete || !shoppingList) return;

    try {
      await actions.deleteItem(itemToDelete, shoppingList);
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
      await actions.addArticleToList(shoppingList, article, quantity, unit);
    } catch (err: any) {
      globalError = err.message || 'Une erreur est survenue';
    }
  }

  // Ajouter un item à la liste
  async function addManualItem() {
    if (!newItemLabel.trim() || !shoppingList) return;

    try {
      await actions.addManualItem(shoppingList, newItemLabel, selectedArticleId, selectedArticleAisle);
      newItemLabel = '';
      selectedArticleId = null;
      selectedArticleAisle = null;
    } catch (err: any) {
      globalError = err.message || 'Une erreur est survenue';
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
      await actions.updateItemQuantity(itemId, editQuantity, editUnit, shoppingList);
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
      await actions.updateItemStore(itemId, store?.id || null, shoppingList);
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
      try {
        await actions.handleStoreCreated(currentEditingItemId, newStoreName, loadShoppingList);
      } catch (err) {
        console.error('Erreur lors de la gestion de la nouvelle enseigne:', err);
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
    const { scrollZone, maxScrollSpeed } = AUTO_SCROLL_CONFIG;
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
        }, AUTO_SCROLL_CONFIG.scrollInterval);
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
    if (!shoppingList) return;

    try {
      await actions.handleDropOnAisle(state, targetStoreKey, targetAisleKey, shoppingList, (storeKey) => {
        flashingStore = storeKey;
        setTimeout(() => {
          flashingStore = null;
        }, ANIMATION_CONFIG.flashDuration);
      });
    } catch (err: any) {
      globalError = err.message || 'Erreur lors du déplacement';
    }
  }

  async function handleDropOnStore(state: DragDropState<ShoppingListItem>, targetStoreKey: string) {
    if (!shoppingList) return;

    try {
      await actions.handleDropOnStore(state, targetStoreKey, shoppingList, (storeKey) => {
        flashingStore = storeKey;
        setTimeout(() => {
          flashingStore = null;
        }, ANIMATION_CONFIG.flashDuration);
      });
    } catch (err: any) {
      globalError = err.message || 'Erreur lors du déplacement';
    }
  }

  // Filtrer les items selon l'enseigne sélectionnée
  let filteredItems = $derived(() => {
    if (!shoppingList) return [];
    return filterItemsByStore(shoppingList.items, selectedStoreFilter);
  });

  // Grouper les items par enseigne puis par rayon
  let groupedItems = $derived(() => {
    const items = filteredItems();

    if (groupBy === 'aisle') {
      return groupItemsByAisle(items);
    } else {
      return groupItemsByStoreAndAisle(items);
    }
  });

  // Liste des enseignes disponibles pour le filtre
  let availableStores = $derived(() => {
    return getAvailableStores(shoppingList);
  });

  function goBack() {
    window.location.href = '/shopping-lists';
  }

  // Statistiques
  let stats = $derived(() => {
    return calculateStats(shoppingList);
  });

  // Charger au montage
  $effect(() => {
    loadShoppingList();
  });
</script>

<Layout title={shoppingList?.name || 'Liste de courses'} currentPage="/shopping-lists" {user}>
  <div class="shopping-list-detail">
    {#if loading}
      <div class="shopping-list-detail__loading">
        <div class="shopping-list-detail__spinner"></div>
        <p>Chargement de la liste...</p>
      </div>
    {:else if error}
      <div class="shopping-list-detail__error">
        <p class="shopping-list-detail__error-message">{error}</p>
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

      <div class="shopping-list-detail__print-button no-print">
        <Button onclick={handlePrint} variant="secondary-full" size="medium">
          <Printer size={18} /> Imprimer
        </Button>
      </div>

      {#if globalError}
        <div class="shopping-list-detail__error-banner">
          <span>{globalError}</span>
          <button onclick={() => { globalError = ''; }}>✕</button>
        </div>
      {/if}

      <div class="shopping-list-detail__items">
        {#if groupBy === 'aisle'}
          <!-- Groupement simple par rayon -->
          {#each Array.from(groupedItems()) as [groupKey, group]}
            <div class="shopping-list-detail__group">
              <h2 class="shopping-list-detail__group-title">{group.label}</h2>
              <div
                class="shopping-list-detail__group-items"
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
              class="shopping-list-detail__store"
              class:shopping-list-detail__store--flashing={flashingStore === storeKey}
              style="{storeGroup.color ? `border-left: 4px solid ${storeGroup.color};` : ''}"
              use:droppable={{
                container: `store-${storeKey}`,
                callbacks: {
                  onDrop: (state) => handleDropOnStore(state, storeKey)
                }
              }}
            >
              <h2 class="shopping-list-detail__store-title">{storeGroup.label}</h2>

              {#each Array.from(storeGroup.aisles) as [aisleKey, aisleGroup]}
                <div class="shopping-list-detail__store-aisle">
                  <h3 class="shopping-list-detail__store-aisle-title">
                    {#if aisleKey !== 'NON_CLASSE'}
                      <Dot color={getBadgeColor(StoreAisleColors[aisleKey])} size="small" />
                    {/if}
                    {aisleGroup.label}
                  </h3>
                  <div
                    class="shopping-list-detail__store-aisle-items"
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

    &__loading,
    &__error {
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

    &__error-message {
      color: $color-danger-dark;
    }

    &__error-banner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: $spacing-base;
      background: $color-background-danger;
      border: $border-width-base solid $color-danger;
      border-radius: $radius-lg;
      color: $color-danger;
      margin: $spacing-base 0;
      font-weight: $font-weight-medium;

      button {
        background: none;
        border: none;
        color: $color-danger;
        cursor: pointer;
        font-size: $font-size-xl;
        padding: 0 $spacing-sm;
        line-height: 1;

        &:hover {
          opacity: $opacity-70;
        }
      }
    }

    &__items {
      display: flex;
      flex-direction: column;
      gap: $spacing-xl;
    }

    &__group {
      padding-left: $spacing-sm;

      &-title {
        margin: 0 0 $spacing-base 0;
        font-size: $font-size-xl;
        color: $color-text-primary;
        padding-bottom: $spacing-sm;
        border-bottom: $border-width-base solid $color-border-primary;
      }

      &-items {
        display: grid;
        grid-template-columns: 1fr;
        gap: $spacing-base;
        min-height: 60px;
        transition: all $transition-base ease;
        border-radius: $radius-md;
        padding: $spacing-xs;

        @media (min-width: $breakpoint-md) {
          grid-template-columns: repeat(2, 1fr);
        }

        @media (min-width: $breakpoint-lg) {
          grid-template-columns: repeat(3, 1fr);
        }

        // Drop zone visual feedback
        &[data-drop-target="true"] {
          background: $color-primary-alpha-10;
          border: $border-width-base dashed $brand-primary;
          padding: $spacing-sm;
        }
      }
    }

    &__store {
      padding-left: $spacing-sm;
      margin-bottom: $spacing-xl;
      transition: all $transition-base ease;

      // Drop zone visual feedback
      &[data-drop-target="true"] {
        background: $color-primary-alpha-05;
        border-left-width: 6px;
        padding: $spacing-sm;
        border-radius: $radius-lg;
      }

      // Animation flash quand un article est déposé
      &--flashing {
        animation: storeFlash 0.8s ease-out;

        .shopping-list-detail__store-title {
          animation: storeTitlePulse 0.8s ease-out;
        }
      }

      &-title {
        margin: 0 0 $spacing-lg 0;
        font-size: $font-size-2xl;
        color: $color-text-primary;
        padding-bottom: $spacing-md;
        border-bottom: $border-width-thick solid $color-border-primary;
        font-weight: $font-weight-bold;
        transition: all $transition-slow ease;
      }

      &-aisle {
        margin-bottom: $spacing-lg;

        &-title {
          margin: 0 0 $spacing-md 0;
          font-size: $font-size-lg;
          color: $color-text-secondary;
          padding-bottom: $spacing-sm;
          padding-left: $spacing-sm;
          border-bottom: $border-width-thin solid $color-border-primary;
          font-weight: $font-weight-semibold;
          display: flex;
          align-items: center;
          gap: $spacing-sm;
        }

        &-items {
          display: grid;
          grid-template-columns: 1fr;
          gap: $spacing-base;
          padding-left: $spacing-base;
          min-height: 60px;
          transition: all $transition-base ease;
          border-radius: $radius-md;

          @media (min-width: $breakpoint-md) {
            grid-template-columns: repeat(2, 1fr);
          }

          @media (min-width: $breakpoint-lg) {
            grid-template-columns: repeat(3, 1fr);
          }

          // Drop zone visual feedback for aisle subgroups
          &[data-drop-target="true"] {
            background: $color-primary-alpha-10;
            border: $border-width-base dashed $brand-primary;
            padding: $spacing-sm;
          }
        }
      }
    }

    &__print-button {
      display: flex;
      justify-content: flex-end;
      margin-bottom: $spacing-md;
    }
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  // Styles for item content (inside ListItem children snippet)
  .drag-handle {
    cursor: grab;
    color: $color-text-tertiary;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color $transition-base;

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
    padding: $spacing-xs 0;
    transition: opacity $transition-base;
    display: flex;
    align-items: center;
    gap: $spacing-xs;

    &:hover {
      opacity: $opacity-70;
    }

    :global(.edit-icon) {
      color: $color-text-tertiary;
      opacity: $opacity-50;
      flex-shrink: 0;
      transition: opacity $transition-base;
      align-self: flex-start;
      margin-top: -2px;
    }

    &:hover :global(.edit-icon) {
      opacity: $opacity-80;
    }
  }

  .item-quantity {
    font-size: $font-size-sm;
    color: $color-text-secondary;
    font-weight: $font-weight-semibold;
  }

  .item-quantity-empty {
    font-size: $font-size-sm;
    color: $color-text-tertiary;
    font-style: italic;
    opacity: $opacity-70;
  }

  .item-edit-form {
    display: flex;
    gap: $spacing-sm;
    align-items: center;
    margin-top: $spacing-sm;
    flex-wrap: wrap;

    .edit-actions {
      display: flex;
      gap: $spacing-xs;
      margin-left: auto;
    }
  }

  .item-store-display {
    cursor: pointer;
    padding: $spacing-xs 0;
    transition: opacity $transition-base;
    display: flex;
    align-items: center;
    gap: $spacing-xs;

    &:hover {
      opacity: $opacity-70;
    }

    :global(.edit-icon) {
      color: $color-text-tertiary;
      opacity: $opacity-50;
      flex-shrink: 0;
      transition: opacity $transition-base;
      align-self: flex-start;
      margin-top: -2px;
    }

    &:hover :global(.edit-icon) {
      opacity: $opacity-80;
    }
  }

  .item-store {
    font-size: $font-size-sm;
    color: $brand-primary;
    font-weight: $font-weight-semibold;
  }

  .item-store-empty {
    font-size: $font-size-sm;
    color: $color-text-tertiary;
    font-style: italic;
    opacity: $opacity-70;
  }

  .item-store-edit {
    display: flex;
    gap: $spacing-sm;
    align-items: center;
    margin-top: $spacing-sm;
  }

  .item-note {
    margin: 0;
    font-size: $font-size-sm;
    color: $color-text-tertiary;
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
      background: $color-primary-alpha-15;
      transform: scale(1);
    }
    50% {
      background: $color-primary-alpha-25;
      transform: scale(1.01);
      box-shadow: 0 4px 20px $color-primary-alpha-30;
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
      color: $color-text-primary;
    }
    50% {
      transform: scale(1.05);
      color: $brand-primary;
    }
    100% {
      transform: scale(1);
      color: $color-text-primary;
    }
  }

  // Styles d'impression
  @media print {
    // Masquer les éléments non nécessaires
    :global(.layout__footer),
    :global(header),
    :global(nav),
    .shopping-list-detail__error-banner,
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
