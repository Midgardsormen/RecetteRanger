<script lang="ts">
  import { Drawer, SectionTitle } from '../../components/ui';
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

  // État du formulaire
  let formData = $state<RecipeFormData>({
    label: '',
    category: RecipeCategory.PLAT,
    difficulty: RecipeDifficulty.MEDIUM,
    cookMinutes: 0,
    prepMinutes: 0,
    servings: 1,
    imageUrl: '',
    sourceUrl: '',
    visibility: RecipeVisibility.PRIVATE,
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
          category: RecipeCategory.PLAT,
          difficulty: RecipeDifficulty.MEDIUM,
          cookMinutes: 0,
          prepMinutes: 0,
          servings: 1,
          imageUrl: '',
          sourceUrl: '',
          visibility: RecipeVisibility.PRIVATE,
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

    if (currentStep === 1) {
      if (formData.label.trim().length < 3) {
        errors.label = 'Le nom doit contenir au moins 3 caractères';
        isValid = false;
      }
      if (formData.servings < 1) {
        errors.servings = 'Le nombre de personnes doit être au moins 1';
        isValid = false;
      }
    } else if (currentStep === 2) {
      if (formData.ingredients.length === 0) {
        errors.ingredients = 'Ajoutez au moins un ingrédient';
        isValid = false;
      }
    } else if (currentStep === 3) {
      if (formData.steps.length === 0) {
        errors.steps = 'Ajoutez au moins une étape';
        isValid = false;
      }
      // Vérifier que toutes les étapes ont une description
      formData.steps.forEach((step, index) => {
        if (!step.description.trim()) {
          errors[`step-${index}`] = 'La description est requise';
          isValid = false;
        }
      });
    }

    return isValid;
  }

  // Fonction pour mettre à jour formData
  function updateFormData(updates: Partial<RecipeFormData>) {
    formData = { ...formData, ...updates };
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
      ? 'Ingrédients'
      : 'Étapes de préparation';
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
  <SectionTitle>{getSectionTitle()}</SectionTitle>

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
    />
  {:else if currentStep === 3}
    <RecipeStep3Steps
      {formData}
      {errors}
      onUpdate={updateFormData}
    />
  {/if}
</Drawer>

