<script lang="ts">
  import NumberBadge from './NumberBadge.svelte';
  import { Clock } from 'lucide-svelte';

  let {
    stepNumber,
    description,
    duration,
    badgeColor = 'quaternary',
    badgeSize = 'medium',
    badgeVariant = 'filled',
    badgeShape = 'circle'
  }: {
    stepNumber: number;
    description: string;
    duration?: string;
    badgeColor?: 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'success' | 'danger' | 'warning' | 'info' | 'neutral';
    badgeSize?: 'small' | 'medium' | 'large';
    badgeVariant?: 'filled' | 'outlined' | 'ghost';
    badgeShape?: 'circle' | 'rounded' | 'square';
  } = $props();
</script>

<div class="step-item">
  <NumberBadge
    number={stepNumber}
    size={badgeSize}
    variant={badgeVariant}
    color={badgeColor}
    shape={badgeShape}
  />
  <div class="step-content">
    <p class="step-description">{description}</p>
    {#if duration}
      <div class="step-duration">
        <Clock class="duration-icon" size={16} />
        <span>{duration}</span>
      </div>
    {/if}
  </div>
</div>

<style lang="scss">
  @use '../../styles/variables' as *;

  .step-item {
    display: flex;
    gap: 1rem;
    padding: 1rem;
    border-radius: $radius-lg;
    background: $color-background-secondary;
    transition: background $transition-base $transition-ease;

    &:hover {
      background: $color-gray-100;
    }
  }

  .step-content {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    flex: 1;
  }

  .step-description {
    margin: 0;
    color: $color-text-primary;
    line-height: $line-height-relaxed;
    font-size: $font-size-base;
  }

  .step-duration {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: $font-size-sm;
    color: $color-text-secondary;
    font-weight: $font-weight-medium;
  }

  :global(.duration-icon) {
    flex-shrink: 0;
  }
</style>
