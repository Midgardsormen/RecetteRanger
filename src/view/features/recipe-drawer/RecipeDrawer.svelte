<script lang="ts">
  import { Drawer, SectionTitle, Button } from '../../components/ui';
  import RecipeStep1General from './RecipeStep1General.svelte';
  import RecipeStep2Ingredients from './RecipeStep2Ingredients.svelte';
  import RecipeStep3Steps from './RecipeStep3Steps.svelte';
  import { apiService } from '../../services/api.service';
  import type {
    RecipeFormData,
    CreateRecipeDto,
    Recipe
  } from '../../types/recipe.types';
  import { RecipeCategory, RecipeDifficulty, RecipeVisibility } from '../../types/recipe.types';

  interface Props {
    isOpen?: boolean;
    recipe?: Recipe | null;
    onSave: () => void;
    onClose: () => void;
  }

  let { isOpen = false, recipe = null, onSave, onClose }: Props = $props();

  // Gestion des étapes
  let currentStep = $state<1 | 2 | 3>(1);

  // Clé unique pour forcer la recréation des composants à chaque ouverture
  let drawerOpenKey = $state('');

  // Callback pour l'action de la section (bouton à droite du titre)
  let sectionActionCallback = $state<(() => void) | null>(null);

  // État du formulaire
  let formData = $state<RecipeFormData>({
    label: '',
    category: '' as any,
    difficulty: '' as any,
    cookMinutes: 0,
    prepMinutes: 0,
    servings: 1,
    imageUrl: '',
    sourceUrl: '',
    visibility: '' as any,
    materiel: [],
    appareils: [],
    ingredients: [],
    steps: []
  });

  // Validation et état
  let saving = $state(false);
  let errors = $state<Record<string, string>>({});

  // Réinitialiser ou charger les données quand le drawer s'ouvre/ferme
  $effect(() => {
    if (isOpen) {
      currentStep = 1;
      // Générer une nouvelle clé unique à chaque ouverture
      drawerOpenKey = `${Date.now()}-${recipe?.id || 'new'}`;

      if (recipe) {
        // Mode édition : charger les données de la recette
        formData = {
          label: recipe.label,
          category: RecipeCategory.PLAT, // TODO: récupérer depuis recipe quand category sera ajouté
          difficulty: recipe.difficulty,
          cookMinutes: recipe.cookMinutes,
          prepMinutes: recipe.prepMinutes,
          servings: recipe.servings,
          imageUrl: recipe.imageUrl || '',
          sourceUrl: recipe.sourceUrl || '',
          visibility: recipe.visibility || RecipeVisibility.PRIVATE,
          materiel: recipe.materiel || [],
          appareils: recipe.appareils || [],
          ingredients: recipe.ingredients.map(ing => ({
            ingredientId: ing.ingredientId,
            ingredientLabel: ing.ingredient?.label || '',
            quantity: ing.quantity?.toString() || '',
            unit: ing.unit || '',
            note: ing.note || '',
            scalable: ing.scalable !== undefined ? ing.scalable : true,
            availableUnits: ing.ingredient?.units || []
          })),
          steps: recipe.steps
            .sort((a, b) => a.stepNumber - b.stepNumber)
            .map(step => ({
              description: step.description,
              durationMinutes: step.durationMinutes?.toString() || ''
            }))
        };
      } else {
        // Mode création : formulaire vide
        formData = {
          label: '',
          category: '' as any,
          difficulty: '' as any,
          cookMinutes: 0,
          prepMinutes: 0,
          servings: 1,
          imageUrl: '',
          sourceUrl: '',
          visibility: '' as any,
          materiel: [],
          appareils: [],
          ingredients: [],
          steps: []
        };
      }

      errors = {};
    }
  });


  function goToStep(step: 1 | 2 | 3) {
    if (step < currentStep) {
      // On peut toujours revenir en arrière
      currentStep = step;
      errors = {};
    } else {
      // Validation avant d'avancer
      if (validateCurrentStep()) {
        currentStep = step;
        errors = {};
      }
    }
  }

  function validateCurrentStep(): boolean {
    errors = {};
    let isValid = true;
    let firstErrorField: string | null = null;

    if (currentStep === 1) {
      if (formData.label.trim().length < 3) {
        errors.label = 'Le nom doit contenir au moins 3 caractères';
        isValid = false;
        if (!firstErrorField) firstErrorField = 'label';
      }
      if (!formData.category) {
        errors.category = 'La catégorie est requise';
        isValid = false;
        if (!firstErrorField) firstErrorField = 'category';
      }
      if (!formData.difficulty) {
        errors.difficulty = 'La difficulté est requise';
        isValid = false;
        if (!firstErrorField) firstErrorField = 'difficulty';
      }
      if (!formData.visibility) {
        errors.visibility = 'La visibilité est requise';
        isValid = false;
        if (!firstErrorField) firstErrorField = 'visibility';
      }
      if (formData.servings < 1) {
        errors.servings = 'Le nombre de personnes doit être au moins 1';
        isValid = false;
        if (!firstErrorField) firstErrorField = 'servings';
      }
    } else if (currentStep === 2) {
      if (formData.ingredients.length === 0) {
        errors.ingredients = 'Ajoutez au moins un ingrédient';
        isValid = false;
        firstErrorField = 'ingredients';
      }
    } else if (currentStep === 3) {
      if (formData.steps.length === 0) {
        errors.steps = 'Ajoutez au moins une étape';
        isValid = false;
        firstErrorField = 'steps';
      }
      // Vérifier que toutes les étapes ont une description
      formData.steps.forEach((step, index) => {
        if (!step.description.trim()) {
          errors[`step-${index}`] = 'La description est requise';
          isValid = false;
          if (!firstErrorField) firstErrorField = `step-description-${index}`;
        }
      });
    }

    // Scroller jusqu'au premier champ en erreur
    if (!isValid && firstErrorField) {
      setTimeout(() => {
        scrollToFirstError(firstErrorField);
      }, 100);
    }

    return isValid;
  }

  function scrollToFirstError(fieldName: string) {
    // Chercher le FormField par data-field-name, puis par ID ou name en fallback
    const element = document.querySelector(`[data-field-name="${fieldName}"]`) ||
                    document.getElementById(fieldName) ||
                    document.querySelector(`[name="${fieldName}"]`) ||
                    document.querySelector(`[id*="${fieldName}"]`);

    if (element) {
      // Trouver le conteneur scrollable (drawer__body)
      const drawerBody = element.closest('.drawer__body');

      if (drawerBody) {
        // Calculer la position de l'élément par rapport au conteneur
        const elementRect = element.getBoundingClientRect();
        const containerRect = drawerBody.getBoundingClientRect();
        const scrollTop = drawerBody.scrollTop;
        const targetScroll = scrollTop + (elementRect.top - containerRect.top) - 100; // -100px pour un peu d'espace en haut

        // Scroller le conteneur avec animation smooth
        drawerBody.scrollTo({
          top: targetScroll,
          behavior: 'smooth'
        });
      } else {
        // Fallback si pas de drawer__body trouvé
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      // Focus sur l'input à l'intérieur du FormField si disponible
      const inputElement = element.querySelector('input, textarea, select');
      if (inputElement instanceof HTMLElement) {
        inputElement.focus();
      }
    }
  }

  // Fonction pour mettre à jour formData
  function updateFormData(updates: Partial<RecipeFormData>) {
    formData = { ...formData, ...updates };
  }

  // Fonction pour enregistrer le callback de l'action de section
  function registerSectionAction(callback: (() => void) | null) {
    sectionActionCallback = callback;
  }

  async function handleSubmit() {
    if (!validateCurrentStep()) {
      return;
    }

    saving = true;

    try {
      const data: CreateRecipeDto = {
        label: formData.label.trim(),
        imageUrl: formData.imageUrl.trim() || undefined,
        description: '',
        prepMinutes: formData.prepMinutes,
        cookMinutes: formData.cookMinutes,
        restMinutes: 0,
        servings: formData.servings,
        difficulty: formData.difficulty,
        materiel: formData.materiel.length > 0 ? formData.materiel : undefined,
        appareils: formData.appareils.length > 0 ? formData.appareils : undefined,
        sourceUrl: formData.sourceUrl?.trim() || undefined,
        visibility: formData.visibility,
        ingredients: formData.ingredients.map(ing => ({
          ingredientId: ing.ingredientId,
          quantity: ing.quantity ? parseFloat(ing.quantity) : undefined,
          unit: ing.unit || undefined,
          note: ing.note || undefined,
          scalable: ing.scalable
        })),
        steps: formData.steps.map((step, index) => ({
          stepNumber: index + 1,
          description: step.description.trim(),
          durationMinutes: step.durationMinutes ? parseInt(step.durationMinutes) : undefined
        }))
      };

      if (recipe) {
        // Mode édition
        await apiService.updateRecipe(recipe.id, data);
      } else {
        // Mode création
        await apiService.createRecipe(data);
      }
      onSave();
    } catch (err: any) {
      alert('Erreur : ' + err.message);
    } finally {
      saving = false;
    }
  }

  // Calculer le titre en fonction du mode
  function getTitle(): string {
    return recipe ? 'Modifier la recette' : 'Ajouter une recette';
  }

  // Calculer le titre de la section en fonction de l'étape
  function getSectionTitle(): string {
    return currentStep === 1
      ? 'Informations générales'
      : currentStep === 2
      ? 'Vos ingrédients'
      : 'Étapes de préparation';
  }

  // Vérifier si l'étape actuelle a une action (bouton à droite du titre)
  function hasSectionAction(): boolean {
    return currentStep === 2; // Seulement pour l'étape Ingrédients
  }

  // Actions du drawer en fonction de l'étape
  function getPrimaryAction() {
    return currentStep === 3
      ? {
          label: recipe ? 'Modifier la recette' : 'Créer la recette',
          onClick: handleSubmit,
          disabled: saving,
          loading: saving
        }
      : {
          label: 'Suivant',
          onClick: () => goToStep((currentStep + 1) as 2 | 3),
          disabled: false,
          loading: false
        };
  }

  function getSecondaryAction() {
    return currentStep === 1
      ? {
          label: 'Annuler',
          onClick: onClose
        }
      : undefined;
  }

  function getShowBackButton(): boolean {
    return currentStep > 1;
  }

  function handleBack() {
    if (currentStep > 1) {
      goToStep((currentStep - 1) as 1 | 2);
    }
  }
</script>

<Drawer
  {isOpen}
  title={getTitle()}
  onClose={onClose}
  showBackButton={getShowBackButton()}
  onBack={handleBack}
  primaryAction={getPrimaryAction()}
  secondaryAction={getSecondaryAction()}
>
  {#if currentStep > 1}
    {#if hasSectionAction() && sectionActionCallback}
      <SectionTitle>
        <div class="recipe-drawer__section-header">
          <span class="recipe-drawer__section-title">{getSectionTitle()}</span>
          <Button
            variant="outlined-inverse"
            size="medium"
            onclick={sectionActionCallback}
            class="recipe-drawer__action-button"
          >
            + Créer
          </Button>
        </div>
      </SectionTitle>
    {:else}
      <SectionTitle>{getSectionTitle()}</SectionTitle>
    {/if}
  {/if}

  {#key drawerOpenKey}
    {#if currentStep === 1}
      <RecipeStep1General
        {formData}
        {errors}
        onUpdate={updateFormData}
      />
    {:else if currentStep === 2}
      <RecipeStep2Ingredients
        {formData}
        {errors}
        onUpdate={updateFormData}
        onRegisterSectionAction={registerSectionAction}
      />
    {:else if currentStep === 3}
      <RecipeStep3Steps
        {formData}
        {errors}
        onUpdate={updateFormData}
      />
    {/if}
  {/key}
</Drawer>

<style lang="scss">
  @use '../../styles/variables' as *;

  .recipe-drawer {
    &__section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: $spacing-sm;
      width: 100%;
      :global{
        .button{
          width: auto;
        }
      }
    }

    &__section-title {
      flex: 1;
      min-width: 0;
    }

    &__action-button {
      width: auto;
    }
  }
</style>
