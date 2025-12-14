<script lang="ts">
  import { FormField, ImageUpload, SectionTitle } from '../../components/ui';

  interface Props {
    formData: {
      name: string;
      description: string;
      servings: number;
      imageUrl: string;
    };
    errors: Record<string, string>;
  }

  let { formData, errors }: Props = $props();

  function handleImageChange(url: string) {
    formData.imageUrl = url;
  }
</script>

<div class="menu-step1">
  <FormField
    label="Nom du menu"
    error={errors.name}
    required={true}
  >
      <input
        type="text"
        bind:value={formData.name}
        placeholder="Ex: Goûter d'anniversaire"
        class="form-input"
      />
    </FormField>

    <FormField label="Description">
      <textarea
        bind:value={formData.description}
        placeholder="Décrivez ce menu..."
        class="form-textarea"
        rows="4"
      ></textarea>
    </FormField>

    <FormField
      label="Nombre de personnes"
      error={errors.servings}
      required={true}
    >
      <input
        type="number"
        bind:value={formData.servings}
        min="1"
        class="form-input"
      />
    </FormField>

  <SectionTitle>Image</SectionTitle>
  <ImageUpload
      value={formData.imageUrl}
      onUpload={handleImageChange}
      placeholder="Ajouter une image pour ce menu"
      variant="inverse"
    />
</div>

<style lang="scss">
  @use '../../styles/variables' as *;

  .menu-step1 {
    display: flex;
    flex-direction: column;
    gap: $spacing-lg;
  }

  .form-input,
  .form-textarea {
    width: 100%;
    padding: $spacing-sm;
    border: 1px solid $color-gray-300;
    border-radius: $radius-md;
    font-size: $font-size-base;
    transition: border-color $transition-base;

    &:focus {
      outline: none;
      border-color: $brand-primary;
      box-shadow: 0 0 0 3px rgba($brand-primary, 0.1);
    }

    &::placeholder {
      color: $color-gray-400;
    }
  }

  .form-textarea {
    resize: vertical;
    font-family: inherit;
  }
</style>
