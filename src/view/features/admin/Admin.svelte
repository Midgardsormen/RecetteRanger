<script lang="ts">
  import Layout from '../../layouts/Layout.svelte';
  import { PageHero, Card, NotificationBadge } from '../../components/ui';
  import { Users, UtensilsCrossed } from 'lucide-svelte';
  import { onMount } from 'svelte';
  import { fetchAllAdminNotifications, type AdminNotificationCounts } from '../../components/header/user-menu/admin-notifications.api';
  import { DEFAULT_NOTIFICATION_COUNTS } from '../../components/header/user-menu/admin-notifications.config';
  import { formatPendingUsersNotification, formatIncompleteIngredientsNotification } from '../../utils/text.utils';

  // Recevoir les données du SSR
  let { user = null }: { user?: any } = $props();

  let adminNotifications = $state<AdminNotificationCounts>({ ...DEFAULT_NOTIFICATION_COUNTS });

  const isAdmin = $derived(user?.role === 'ADMIN');

  const adminCards = $derived([
    {
      title: 'Gestion des utilisateurs',
      description: 'Gérer les comptes utilisateurs, modifier les profils et les rôles',
      icon: Users,
      href: '/users',
      notificationCount: adminNotifications.pendingUsers,
      notificationText: formatPendingUsersNotification(adminNotifications.pendingUsers),
    },
    {
      title: 'Gestion des ingrédients',
      description: 'Gérer les ingrédients et articles',
      icon: UtensilsCrossed,
      href: '/articles',
      notificationCount: adminNotifications.incompleteIngredients,
      notificationText: formatIncompleteIngredientsNotification(adminNotifications.incompleteIngredients),
    },
  ]);

  function goTo(href: string) {
    window.location.href = href;
  }

  onMount(async () => {
    if (isAdmin) {
      const counts = await fetchAllAdminNotifications(isAdmin);
      adminNotifications = counts;
    }
  });
</script>

<Layout title="Administration" currentPage="/admin" {user}>
  <div class="admin">
    <PageHero
      title="Administration"
      subtitle="Tableau de bord administrateur"
    />

    <div class="admin__grid">
      {#each adminCards as card}
        <div class="admin-card-wrapper">
          {#if card.notificationCount > 0}
            <div class="admin-card-badge">
              <NotificationBadge
                count={card.notificationCount}
                size="medium"
                variant="danger"
                position="top-right"
                animate={true}
              />
            </div>
          {/if}
          <Card
            title={card.title}
            subtitle={card.description}
            clickable={true}
            onclick={() => goTo(card.href)}
          >
            {#snippet children()}
              <div class="admin-card-content">
                <div class="admin-card-icon">
                  <svelte:component this={card.icon} size={48} />
                </div>
                {#if card.notificationText}
                  <div class="admin-card-notification">{card.notificationText}</div>
                {/if}
              </div>
            {/snippet}
          </Card>
        </div>
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

  .admin-card-wrapper {
    position: relative;
  }

  .admin-card-badge {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 10;
  }

  .admin-card-content {
    display: flex;
    flex-direction: column;
    gap: $spacing-base;
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

  .admin-card-notification {
    padding: $spacing-sm $spacing-base;
    background: rgba($color-danger, 0.1);
    border-radius: $radius-sm;
    font-size: $font-size-sm;
    color: $color-danger;
    font-weight: $font-weight-semibold;
    text-align: center;
  }
</style>
