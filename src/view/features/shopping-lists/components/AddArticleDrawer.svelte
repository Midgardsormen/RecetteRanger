<script lang="ts">
  import { Drawer } from '../../../components/ui';
  import { Input, Select, Checkbox, RadioGroup } from '../../../components/ui/form';
  import { apiService } from '../../../services/api.service';
  import { StoreAisle, Unit } from '../../../types/enums';

  interface Props {
    isOpen: boolean;
    initialLabel?: string;
    onClose: () => void;
    onArticleCreated: (article: any) => void;
  }

  let { isOpen, initialLabel = '', onClose, onArticleCreated }: Props = $props();

  // État du formulaire
  let formData = $state({
    label: initialLabel,
    aisle: 'EPICERIE_SALEE' as StoreAisle,
    units: ['UNITE'] as Unit[],
    articleType: 'food' as 'food' | 'non-food',
    imageUrl: '',
    seasonMonths: [] as number[],
  });

  let errors = $state<Record<string, string>>({});
  let submitting = $state(false);

  // Réinitialiser le formulaire quand le drawer s'ouvre
  $effect(() => {
    if (isOpen) {
      formData = {
        label: initialLabel,
        aisle: 'EPICERIE_SALEE',
        units: ['UNITE'],
        articleType: 'food',
        imageUrl: '',
        seasonMonths: [],
      };
      errors = {};
    }
  });

  // Mettre à jour le rayon par défaut quand articleType change
  $effect(() => {
    if (!isOpen) return;

    if (formData.articleType === 'food' && formData.aisle === 'ENTRETIEN_MAISON') {
      formData.aisle = 'EPICERIE_SALEE';
    } else if (formData.articleType === 'non-food' && formData.aisle === 'EPICERIE_SALEE') {
      formData.aisle = 'ENTRETIEN_MAISON';
    }
  });

  // Options de rayons
  const aisleOptions = [
    // Alimentaire
    { value: 'FRUITS_ET_LEGUMES', label: 'Fruits et légumes' },
    { value: 'BOUCHERIE', label: 'Boucherie' },
    { value: 'VOLAILLE', label: 'Volaille' },
    { value: 'CHARCUTERIE', label: 'Charcuterie' },
    { value: 'POISSONNERIE', label: 'Poissonnerie' },
    { value: 'ROTISSERIE', label: 'Rôtisserie' },
    { value: 'BOULANGERIE', label: 'Boulangerie' },
    { value: 'PATISSERIE', label: 'Pâtisserie' },
    { value: 'FROMAGERIE', label: 'Fromagerie' },
    { value: 'TRAITEUR', label: 'Traiteur' },
    { value: 'PRODUITS_LAITIERS', label: 'Produits laitiers' },
    { value: 'OEUFS', label: 'Œufs' },
    { value: 'SURGELES', label: 'Surgelés' },
    { value: 'EPICERIE_SALEE', label: 'Épicerie salée' },
    { value: 'PATES_RIZ_CEREALES', label: 'Pâtes, riz & céréales' },
    { value: 'CONSERVES', label: 'Conserves' },
    { value: 'SAUCES_CONDIMENTS', label: 'Sauces & condiments' },
    { value: 'HUILES_VINAIGRES', label: 'Huiles & vinaigres' },
    { value: 'EPICES_AIDES_CULINAIRES', label: 'Épices & aides culinaires' },
    { value: 'PLATS_CUISINES', label: 'Plats cuisinés' },
    { value: 'SNACKING', label: 'Snacking' },
    { value: 'EPICERIE_SUCREE', label: 'Épicerie sucrée' },
    { value: 'BISCUITS_GATEAUX', label: 'Biscuits & gâteaux' },
    { value: 'CHOCOLATS_CONFISERIES', label: 'Chocolats & confiseries' },
    { value: 'PETIT_DEJEUNER', label: 'Petit-déjeuner' },
    { value: 'CAFE_THE', label: 'Café & thé' },
    { value: 'EAUX', label: 'Eaux' },
    { value: 'SODAS_JUS', label: 'Sodas & jus' },
    { value: 'BIERES', label: 'Bières' },
    { value: 'VINS_SPIRITUEUX', label: 'Vins & spiritueux' },
    { value: 'PRODUITS_BIO', label: 'Produits bio' },
    { value: 'SANS_GLUTEN_DIETETIQUE', label: 'Sans gluten & diététique' },
    { value: 'BEBE', label: 'Bébé' },
    // Non-alimentaire
    { value: 'ANIMALERIE', label: 'Animalerie' },
    { value: 'ENTRETIEN_MAISON', label: 'Entretien de la maison' },
    { value: 'LESSIVE_SOIN_LINGE', label: 'Lessive & soin du linge' },
    { value: 'PAPIER_HYGIENE_MENAGERE', label: 'Papier & hygiène ménagère' },
    { value: 'HYGIENE_BEAUTE', label: 'Hygiène & beauté' },
    { value: 'PARAPHARMACIE', label: 'Parapharmacie' },
    { value: 'PAPETERIE_FOURNITURES', label: 'Papeterie & fournitures' },
    { value: 'PRESSE_LIVRES', label: 'Presse & livres' },
    { value: 'MAISON_DECO', label: 'Maison & déco' },
    { value: 'ARTS_DE_LA_TABLE', label: 'Arts de la table' },
    { value: 'TEXTILE', label: 'Textile' },
    { value: 'ELECTROMENAGER', label: 'Électroménager' },
    { value: 'MULTIMEDIA_HIGH_TECH', label: 'Multimédia & high-tech' },
    { value: 'BRICOLAGE', label: 'Bricolage' },
    { value: 'AUTO_MOBILITE', label: 'Auto & mobilité' },
    { value: 'JARDIN_PLANTES', label: 'Jardin & plantes' },
    { value: 'FLEURS', label: 'Fleurs' },
    { value: 'JEUX_JOUETS', label: 'Jeux & jouets' },
    { value: 'SAISONNIER', label: 'Saisonnier' },
  ];

  // Options d'unités
  const unitOptions = [
    { value: 'UNITE', label: 'Unité' },
    { value: 'GRAMME', label: 'Gramme (g)' },
    { value: 'KILOGRAMME', label: 'Kilogramme (kg)' },
    { value: 'MILLIGRAMME', label: 'Milligramme (mg)' },
    { value: 'LITRE', label: 'Litre (l)' },
    { value: 'MILLILITRE', label: 'Millilitre (ml)' },
    { value: 'CENTILITRE', label: 'Centilitre (cl)' },
    { value: 'CUILLERE_A_CAFE', label: 'Cuillère à café' },
    { value: 'CUILLERE_A_SOUPE', label: 'Cuillère à soupe' },
    { value: 'TASSE', label: 'Tasse' },
    { value: 'VERRE', label: 'Verre' },
    { value: 'BOL', label: 'Bol' },
    { value: 'TRANCHE', label: 'Tranche' },
    { value: 'MORCEAU', label: 'Morceau' },
    { value: 'BRANCHE', label: 'Branche' },
    { value: 'FEUILLE', label: 'Feuille' },
    { value: 'BOUQUET', label: 'Bouquet' },
    { value: 'BOTTE', label: 'Botte' },
    { value: 'GOUSSE', label: 'Gousse' },
    { value: 'SACHET', label: 'Sachet' },
    { value: 'BOITE', label: 'Boîte' },
    { value: 'PAQUET', label: 'Paquet' },
    { value: 'POT', label: 'Pot' },
    { value: 'BARQUETTE', label: 'Barquette' },
  ];

  function toggleUnit(unit: Unit) {
    const index = formData.units.indexOf(unit);
    if (index > -1) {
      formData.units = formData.units.filter(u => u !== unit);
    } else {
      formData.units = [...formData.units, unit];
    }
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {};

    if (!formData.label || formData.label.trim().length < 2) {
      newErrors.label = 'Le nom doit contenir au moins 2 caractères';
    }

    if (!formData.aisle) {
      newErrors.aisle = 'Veuillez sélectionner un rayon';
    }

    if (formData.units.length === 0) {
      newErrors.units = 'Veuillez sélectionner au moins une unité';
    }

    errors = newErrors;
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;

    submitting = true;
    try {
      const newArticle = await apiService.createIngredient({
        label: formData.label.trim(),
        aisle: formData.aisle,
        units: formData.units,
        isFood: formData.articleType === 'food',
        imageUrl: formData.imageUrl || undefined,
        seasonMonths: formData.seasonMonths.length > 0 ? formData.seasonMonths : undefined,
      });

      onArticleCreated(newArticle);
      onClose();
    } catch (err: any) {
      alert('Erreur lors de la création : ' + err.message);
    } finally {
      submitting = false;
    }
  }
</script>

<Drawer
  {isOpen}
  title="Créer un article"
  {onClose}
  primaryAction={{
    label: submitting ? 'Création...' : 'Créer l\'article',
    onClick: handleSubmit,
    disabled: submitting
  }}
  secondaryAction={{
    label: 'Annuler',
    onClick: onClose
  }}
>
  <div class="add-article-drawer">
    <!-- Type d'article -->
    <RadioGroup
      label="Type d'article"
      name="articleType"
      bind:value={formData.articleType}
      options={[
        {
          value: 'food',
          label: 'Alimentaire',
          description: 'Produits alimentaires et ingrédients de cuisine'
        },
        {
          value: 'non-food',
          label: 'Non-alimentaire',
          description: 'Articles ménagers, hygiène, etc.'
        }
      ]}
    />

    <!-- Nom -->
    <div class="form-field">
      <Input
        id="article-label"
        label="Nom de l'article"
        bind:value={formData.label}
        placeholder="Ex: Tomates, Lessive, etc."
        error={errors.label}
        required
      />
    </div>

    <!-- Rayon -->
    <div class="form-field">
      <Select
        id="article-aisle"
        label="Rayon"
        bind:value={formData.aisle}
        options={aisleOptions}
        error={errors.aisle}
        required
      />
    </div>

    <!-- Unités -->
    <div class="form-field">
      <label class="form-label">
        Unités disponibles <span class="required">*</span>
      </label>
      {#if errors.units}
        <p class="error-message">{errors.units}</p>
      {/if}
      <div class="units-grid">
        {#each unitOptions as unit}
          <label class="unit-checkbox">
            <input
              type="checkbox"
              checked={formData.units.includes(unit.value as Unit)}
              onchange={() => toggleUnit(unit.value as Unit)}
            />
            <span>{unit.label}</span>
          </label>
        {/each}
      </div>
    </div>
  </div>
</Drawer>

<style lang="scss">
  @use '../../../styles/variables' as *;

  .add-article-drawer {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .form-field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .form-label {
    font-size: 0.95rem;
    font-weight: 500;
    color: var(--text-color);

    .required {
      color: $color-danger;
      margin-left: 0.25rem;
    }
  }

  .error-message {
    margin: 0;
    font-size: 0.85rem;
    color: $color-danger;
  }

  .units-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 0.75rem;
    max-height: 300px;
    overflow-y: auto;
    padding: 0.5rem;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    background: $color-gray-50;
  }

  .unit-checkbox {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
    background: white;
    border: 1px solid transparent;

    &:hover {
      border-color: $brand-primary;
      background: rgba($brand-primary, 0.05);
    }

    input[type="checkbox"] {
      cursor: pointer;
    }

    span {
      font-size: 0.9rem;
      color: var(--text-color);
    }
  }
</style>
