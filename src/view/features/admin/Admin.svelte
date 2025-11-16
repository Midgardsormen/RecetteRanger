<script lang="ts">
  import Layout from '../../layouts/Layout.svelte';
  import { PageHero, Card } from '../../components/ui';
  import { Users, ShieldCheck } from 'lucide-svelte';

  // Recevoir les données du SSR
  let { user = null }: { user?: any } = $props();

  const adminCards = [
    {
      title: 'Gestion des utilisateurs',
      description: 'Gérer les comptes utilisateurs, modifier les profils et les rôles',
      icon: Users,
      href: '/users',
      color: 'primary'
    }
  ];

  function goTo(href: string) {
    window.location.href = href;
  }
</script>

<Layout title="Administration" currentPage="/admin" {user}>
  <div class="admin">
    <PageHero
      title="Administration"
      subtitle="Tableau de bord administrateur"
    />

    <div class="admin__grid">
      {#each adminCards as card}
        <Card
          title={card.title}
          subtitle={card.description}
          clickable={true}
          onclick={() => goTo(card.href)}
        >
          {#snippet children()}
            <div class="admin-card-icon">
              <svelte:component this={card.icon} size={48} />
            </div>
          {/snippet}
        </Card>
      {/each}
    </div>
  </div>
</Layout>

<style lang="scss">
  @use '../../styles/variables' as *;

  .admin {
    display: flex;
    flex-direction: column;
    gap: $spacing-lg;

    &__grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: $spacing-base * 1.5;

      @media (min-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
      }

      @media (min-width: 1280px) {
        grid-template-columns: repeat(3, 1fr);
      }
    }
  }

  .admin-card-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: $spacing-base * 2;
    color: $brand-primary;

    :global(svg) {
      opacity: 0.7;
    }
  }
</style>
