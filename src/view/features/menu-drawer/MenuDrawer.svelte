<script lang="ts">
  import { Drawer, SectionTitle, Button } from '../../components/ui';
  import MenuStep1General from './MenuStep1General.svelte';
  import MenuStep2Items from './MenuStep2Items.svelte';
  import { apiService } from '../../services/api.service';
  import type { Menu, CreateMenuDto } from '../../types/menu.types';

  interface MenuFormData {
    name: string;
    description: string;
    servings: number;
    imageUrl: string;
    items: Array<{
      recipeId?: string;
      recipeLabel?: string;
      ingredientId?: string;
      ingredientLabel?: string;
      quantity?: number;
      unit?: string;
      servings?: number;
    }>;
  }

  interface Props {
    isOpen?: boolean;
    menu?: Menu | null;
    onSave: () => void;
    onClose: () => void;
  }

  let { isOpen = false, menu = null, onSave, onClose }: Props = $props();

  // Gestion des étapes
  let currentStep = $state<1 | 2>(1);
  let drawerOpenKey = $state('');

  // État du formulaire
  let formData = $state<MenuFormData>({
    name: '',
    description: '',
    servings: 1,
    imageUrl: '',
    items: []
  });

  // Validation et état
  let saving = $state(false);
  let errors = $state<Record<string, string>>({});

  // Réinitialiser ou charger les données quand le drawer s'ouvre/ferme
  $effect(() => {
    if (isOpen) {
      currentStep = 1;
      drawerOpenKey = `${Date.now()}-${menu?.id || 'new'}`;

      if (menu) {
        // Mode édition
        formData = {
          name: menu.name,
          description: menu.description || '',
          servings: menu.servings,
          imageUrl: menu.imageUrl || '',
          items: menu.items?.map(item => ({
            recipeId: item.recipeId || undefined,
            recipeLabel: item.recipe?.label || '',
            ingredientId: item.ingredientId || undefined,
            ingredientLabel: item.ingredient?.label || '',
            quantity: item.quantity ? Number(item.quantity) : undefined,
            unit: item.unit || undefined,
            servings: item.servings
          })) || []
        };
      } else {
        // Mode création
        formData = {
          name: '',
          description: '',
          servings: 1,
          imageUrl: '',
          items: []
        };
      }

      errors = {};
    }
  });

  function goToStep(step: 1 | 2) {
    if (step < currentStep) {
      currentStep = step;
      errors = {};
    } else {
      if (validateCurrentStep()) {
        currentStep = step;
        errors = {};
      }
    }
  }

  function validateCurrentStep(): boolean {
    errors = {};
    let isValid = true;

    if (currentStep === 1) {
      if (formData.name.trim().length < 3) {
        errors.name = 'Le nom doit contenir au moins 3 caractères';
        isValid = false;
      }
      if (formData.servings < 1) {
        errors.servings = 'Le nombre de personnes doit être au moins 1';
        isValid = false;
      }
    }

    if (currentStep === 2) {
      if (formData.items.length === 0) {
        errors.items = 'Ajoutez au moins un item (recette ou ingrédient)';
        isValid = false;
      }
    }

    return isValid;
  }

  async function handleSave() {
    // Valider l'étape actuelle
    if (!validateCurrentStep()) {
      return;
    }

    // Si pas à la dernière étape, passer à la suivante
    if (currentStep < 2) {
      goToStep((currentStep + 1) as 1 | 2);
      return;
    }

    // Sinon, sauvegarder
    saving = true;
    errors = {};

    try {
      const dto: CreateMenuDto = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        servings: formData.servings,
        imageUrl: formData.imageUrl.trim() || undefined,
        items: formData.items.map(item => ({
          recipeId: item.recipeId,
          ingredientId: item.ingredientId,
          quantity: item.quantity,
          unit: item.unit,
          servings: item.servings || 1
        }))
      };

      if (menu) {
        await apiService.updateMenu(menu.id, dto);
      } else {
        await apiService.createMenu(dto);
      }

      onSave();
      onClose();
    } catch (error: any) {
      console.error('Error saving menu:', error);
      errors.general = error.message || 'Erreur lors de la sauvegarde du menu';
    } finally {
      saving = false;
    }
  }

  function handlePrevious() {
    if (currentStep > 1) {
      goToStep((currentStep - 1) as 1 | 2);
    }
  }

  $effect(() => {
    console.log('MenuDrawer formData:', formData);
  });
</script>

<Drawer
  {isOpen}
  title={`${menu ? 'Modifier le menu' : 'Nouveau menu'} - Étape ${currentStep} sur 2`}
  {onClose}
  showBackButton={currentStep > 1}
  onBack={handlePrevious}
  primaryAction={{
    label: currentStep < 2 ? 'Suivant →' : (menu ? 'Modifier' : 'Créer'),
    onClick: handleSave,
    disabled: saving,
    loading: saving
  }}
  secondaryAction={currentStep === 1 ? {
    label: 'Annuler',
    onClick: onClose
  } : undefined}
>
  <div class="menu-drawer">
    {#if errors.general}
      <div class="menu-drawer__error">{errors.general}</div>
    {/if}

    <div class="menu-drawer__steps">
      {#if currentStep === 1}
        <MenuStep1General
          key={drawerOpenKey}
          bind:formData={formData}
          {errors}
        />
      {:else if currentStep === 2}
        <MenuStep2Items
          key={drawerOpenKey}
          bind:formData={formData}
          {errors}
        />
      {/if}
    </div>
  </div>
</Drawer>

<style lang="scss">
  @use '../../styles/variables' as *;

  .menu-drawer {
    display: flex;
    flex-direction: column;

    &__error {
      padding: $spacing-base;
      background: $color-background-danger;
      border: 1px solid $color-danger;
      border-radius: $radius-md;
      color: $color-danger;
      margin-bottom: $spacing-lg;
    }

    &__steps {
      display: flex;
      flex-direction: column;
      gap: $spacing-lg;
    }
  }
</style>
