<script lang="ts">
  import type { FormDrawerProps } from '../../../types/ui.types';
  import Drawer from '../Drawer/Drawer.svelte';
  import Alert from '../Alert/Alert.svelte';
  import { FORM_DRAWER_DEFAULTS, FORM_DRAWER_LABELS } from './FormDrawer.config';

  let {
    isOpen = FORM_DRAWER_DEFAULTS.isOpen,
    title,
    mode = FORM_DRAWER_DEFAULTS.mode,
    saving = FORM_DRAWER_DEFAULTS.saving,
    errors = FORM_DRAWER_DEFAULTS.errors,
    duplicates = FORM_DRAWER_DEFAULTS.duplicates,
    checkingDuplicates = FORM_DRAWER_DEFAULTS.checkingDuplicates,
    duplicateMessage,
    onSave,
    onClose,
    saveLabel,
    cancelLabel,
    children,
  }: FormDrawerProps = $props();

  // Computed labels
  const primaryLabel = $derived(
    saveLabel || (mode === 'create' ? FORM_DRAWER_LABELS.createButton : FORM_DRAWER_LABELS.saveButton)
  );
  const secondaryLabel = $derived(cancelLabel || FORM_DRAWER_LABELS.cancelButton);
  const loadingLabel = $derived(FORM_DRAWER_LABELS.savingText);

  // Check if there are duplicates
  const hasDuplicates = $derived((duplicates?.length || 0) > 0);

  // Get duplicate warning message
  const duplicateWarning = $derived(
    duplicateMessage || FORM_DRAWER_LABELS.duplicateWarningMessage
  );
</script>

<Drawer
  {isOpen}
  {title}
  onClose={onClose}
  primaryAction={{
    label: saving ? loadingLabel : primaryLabel,
    onClick: onSave,
    loading: saving,
    disabled: saving || checkingDuplicates,
  }}
  secondaryAction={{
    label: secondaryLabel,
    onClick: onClose,
    disabled: saving,
  }}
>
  <div class="form-drawer">
    <!-- Duplicate Warning -->
    {#if hasDuplicates && !checkingDuplicates}
      <Alert variant="warning" title={FORM_DRAWER_LABELS.duplicateWarningTitle}>
        <p class="form-drawer__duplicate-message">{duplicateWarning}</p>
        <ul class="form-drawer__duplicate-list">
          {#each duplicates as duplicate}
            <li class="form-drawer__duplicate-item">
              {duplicate.label}
              {#if duplicate.similarity}
                <span class="form-drawer__similarity">
                  ({Math.round(duplicate.similarity * 100)}% similaire)
                </span>
              {/if}
            </li>
          {/each}
        </ul>
      </Alert>
    {/if}

    <!-- Checking Duplicates -->
    {#if checkingDuplicates}
      <Alert variant="info">
        {FORM_DRAWER_LABELS.checkingDuplicates}
      </Alert>
    {/if}

    <!-- Form Content -->
    <div class="form-drawer__content">
      {@render children?.()}
    </div>
  </div>
</Drawer>

<style lang="scss">
  @use '../../../styles/variables' as *;

  .form-drawer {
    display: flex;
    flex-direction: column;
    gap: $spacing-lg;

    &__content {
      display: flex;
      flex-direction: column;
      gap: $spacing-base;
    }

    &__duplicate-message {
      margin-bottom: $spacing-sm;
      color: $color-text-inverse;
    }

    &__duplicate-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: $spacing-xs;
    }

    &__duplicate-item {
      color: $color-text-inverse;
      font-size: $font-size-sm;
      padding: $spacing-xs $spacing-sm;
      background: $color-warning-alpha-10;
      border-radius: $radius-sm;
      border-left: $border-width-thick solid $color-warning;
    }

    &__similarity {
      opacity: 0.8;
      font-size: $font-size-xs;
      margin-left: $spacing-xs;
    }
  }
</style>
