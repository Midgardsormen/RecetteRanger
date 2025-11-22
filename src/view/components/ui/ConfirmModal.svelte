<script lang="ts">
  import Modal from './Modal/Modal.svelte';
  import type { ConfirmModalProps } from '../../types';

  let {
    isOpen = false,
    title = 'Confirmation',
    message,
    confirmLabel = 'Confirmer',
    cancelLabel = 'Annuler',
    onConfirm,
    onCancel
  }: ConfirmModalProps = $props();
</script>

<Modal
  {isOpen}
  {title}
  size="small"
  onClose={onCancel}
  dangerAction={{
    label: confirmLabel,
    onClick: onConfirm
  }}
  secondaryAction={{
    label: cancelLabel,
    onClick: onCancel
  }}
>
  <p class="confirm-message">{message}</p>
</Modal>

<style lang="scss">
  @use '../../styles/variables' as *;

  .confirm-message {
    font-size: $font-size-base;
    line-height: $line-height-normal;
    color: $color-text-primary;
    margin: 0;
  }
</style>
