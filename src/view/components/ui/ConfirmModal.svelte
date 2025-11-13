<script lang="ts">
  import Modal from './Modal.svelte';

  interface Props {
    isOpen?: boolean;
    title?: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
  }

  let {
    isOpen = false,
    title = 'Confirmation',
    message,
    confirmLabel = 'Confirmer',
    cancelLabel = 'Annuler',
    onConfirm,
    onCancel
  }: Props = $props();
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
