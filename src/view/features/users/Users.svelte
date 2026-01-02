<script lang="ts">
  import { onMount } from 'svelte';
  import Layout from '../../layouts/Layout.svelte';
  import { PageHero, Card, Badge, Filter, Button, ConfirmModal } from '../../components/ui';
  import { User, ShieldCheck, Calendar, Check, X } from 'lucide-svelte';
  import { UserRole } from '../../types/user.types';

  // Recevoir les données du SSR
  let { users: initialUsers = [], user = null }: { users?: any[], user?: any } = $props();

  let users = $state(initialUsers);
  let loading = $state(false);
  let error = $state('');
  let statusFilter = $state<string[]>([]);

  // Modal state
  let showApproveModal = $state(false);
  let showRejectModal = $state(false);
  let selectedUserId = $state<string | null>(null);
  let selectedUserName = $state('');

  onMount(() => {
    // Si pas de données SSR, charger les utilisateurs
    if (users.length === 0) {
      loadUsers();
    }
  });

  async function loadUsers() {
    loading = true;
    error = '';

    try {
      const response = await fetch('http://localhost:3000/api/users', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des utilisateurs');
      }

      users = await response.json();
    } catch (err: any) {
      error = err.message || 'Erreur lors du chargement des utilisateurs';
    } finally {
      loading = false;
    }
  }

  function goToUserProfile(userId: string) {
    window.location.href = `/users/${userId}`;
  }

  function getRoleBadgeVariant(role: string): 'primary' | 'secondary' | 'success' | 'danger' | 'neutral' {
    if (role === UserRole.ADMIN) return 'danger';
    return 'neutral';
  }

  function getRoleLabel(role: string): string {
    if (role === UserRole.ADMIN) return 'Administrateur';
    return 'Utilisateur';
  }

  function getAccountStatusBadgeVariant(status: string): 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'neutral' {
    if (status === 'PENDING') return 'warning';
    if (status === 'APPROVED') return 'success';
    if (status === 'REJECTED') return 'danger';
    return 'neutral';
  }

  function getAccountStatusLabel(status: string): string {
    if (status === 'PENDING') return 'En attente';
    if (status === 'APPROVED') return 'Approuvé';
    if (status === 'REJECTED') return 'Rejeté';
    return status;
  }

  // Filter users by status
  const filteredUsers = $derived(() => {
    if (statusFilter.length === 0) {
      return users;
    }
    return users.filter(u => statusFilter.includes(u.accountStatus));
  });

  // Counts for filter labels
  const pendingCount = $derived(users.filter(u => u.accountStatus === 'PENDING').length);
  const approvedCount = $derived(users.filter(u => u.accountStatus === 'APPROVED').length);
  const rejectedCount = $derived(users.filter(u => u.accountStatus === 'REJECTED').length);

  function handleApproveClick(userId: string, userName: string, event: Event) {
    event.stopPropagation();
    selectedUserId = userId;
    selectedUserName = userName;
    showApproveModal = true;
  }

  function handleRejectClick(userId: string, userName: string, event: Event) {
    event.stopPropagation();
    selectedUserId = userId;
    selectedUserName = userName;
    showRejectModal = true;
  }

  async function approveUser() {
    if (!selectedUserId) return;

    try {
      const response = await fetch(`http://localhost:3000/api/users/${selectedUserId}/approve`, {
        method: 'PATCH',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'approbation');
      }

      await loadUsers();
      showApproveModal = false;
      selectedUserId = null;

      // Dispatch custom event to notify header to refresh badge
      window.dispatchEvent(new CustomEvent('user-status-changed'));
    } catch (err: any) {
      error = err.message || 'Erreur lors de l\'approbation';
    }
  }

  async function rejectUser() {
    if (!selectedUserId) return;

    try {
      const response = await fetch(`http://localhost:3000/api/users/${selectedUserId}/reject`, {
        method: 'PATCH',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Erreur lors du rejet');
      }

      await loadUsers();
      showRejectModal = false;
      selectedUserId = null;

      // Dispatch custom event to notify header to refresh badge
      window.dispatchEvent(new CustomEvent('user-status-changed'));
    } catch (err: any) {
      error = err.message || 'Erreur lors du rejet';
    }
  }
</script>

<Layout title="Gestion des utilisateurs" currentPage="/users" {user}>
  <div class="users">
    <PageHero
      title="Utilisateurs"
      subtitle="Gérer les comptes utilisateurs"
    />

    {#if error}
      <div class="users__error">{error}</div>
    {/if}

    <!-- Filters -->
    {#if !loading && users.length > 0}
      <div class="users__filters">
        <Filter
          label="Statut du compte"
          mode="pills"
          multiple={true}
          options={[
            { value: 'PENDING', label: `En attente (${pendingCount})`, count: pendingCount },
            { value: 'APPROVED', label: `Approuvé (${approvedCount})`, count: approvedCount },
            { value: 'REJECTED', label: `Rejeté (${rejectedCount})`, count: rejectedCount }
          ]}
          bind:value={statusFilter}
        />
      </div>
    {/if}

    {#if loading}
      <div class="users__loading">Chargement...</div>
    {:else if users.length === 0}
      <div class="users__empty">
        <p>Aucun utilisateur trouvé</p>
      </div>
    {:else if filteredUsers().length === 0}
      <div class="users__empty">
        <p>Aucun utilisateur ne correspond aux filtres sélectionnés</p>
      </div>
    {:else}
      <div class="users__grid">
        {#each filteredUsers() as userItem (userItem.id)}
          <Card
            title={userItem.pseudo}
            subtitle={userItem.email}
            clickable={true}
            onclick={() => goToUserProfile(userItem.id)}
          >
            {#snippet children()}
              <div class="user-card-content">
                {#if userItem.avatarUrl}
                  <img src={userItem.avatarUrl} alt={userItem.pseudo} class="user-card-avatar" />
                {:else}
                  <div class="user-card-avatar-placeholder">
                    <User size={40} />
                  </div>
                {/if}

                <div class="user-card-info">
                  <div class="user-card-name">
                    {userItem.firstName} {userItem.lastName}
                  </div>
                  <div class="user-card-meta">
                    <Badge variant={getRoleBadgeVariant(userItem.role)} size="xs">
                      <ShieldCheck size={14} />
                      {getRoleLabel(userItem.role)}
                    </Badge>
                    <Badge variant={getAccountStatusBadgeVariant(userItem.accountStatus)} size="xs">
                      {getAccountStatusLabel(userItem.accountStatus)}
                    </Badge>
                    <span class="user-card-date">
                      <Calendar size={14} />
                      Inscrit le {new Date(userItem.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>

                  <!-- Action buttons for pending users -->
                  {#if userItem.accountStatus === 'PENDING'}
                    <div class="user-card-actions">
                      <Button
                        variant="success"
                        size="small"
                        onclick={(e) => handleApproveClick(userItem.id, `${userItem.firstName} ${userItem.lastName}`, e)}
                      >
                        <Check size={16} />
                        Approuver
                      </Button>
                      <Button
                        variant="danger"
                        size="small"
                        onclick={(e) => handleRejectClick(userItem.id, `${userItem.firstName} ${userItem.lastName}`, e)}
                      >
                        <X size={16} />
                        Rejeter
                      </Button>
                    </div>
                  {/if}
                </div>
              </div>
            {/snippet}
          </Card>
        {/each}
      </div>
    {/if}
  </div>

  <!-- Approve confirmation modal -->
  <ConfirmModal
    isOpen={showApproveModal}
    title="Approuver le compte"
    message={`Êtes-vous sûr de vouloir approuver le compte de ${selectedUserName} ?`}
    confirmText="Approuver"
    confirmVariant="success"
    onConfirm={approveUser}
    onCancel={() => showApproveModal = false}
  />

  <!-- Reject confirmation modal -->
  <ConfirmModal
    isOpen={showRejectModal}
    title="Rejeter le compte"
    message={`Êtes-vous sûr de vouloir rejeter le compte de ${selectedUserName} ?`}
    confirmText="Rejeter"
    confirmVariant="danger"
    onConfirm={rejectUser}
    onCancel={() => showRejectModal = false}
  />
</Layout>

<style lang="scss">
  @use '../../styles/variables' as *;

  .users {
    display: flex;
    flex-direction: column;
    gap: $spacing-lg;

    &__loading,
    &__error,
    &__empty {
      text-align: center;
      padding: $spacing-base * 4;
      color: $color-text-secondary;
      font-size: 1.1rem;
    }

    &__error {
      color: $color-danger;
    }

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

  .user-card-content {
    display: flex;
    align-items: center;
    gap: $spacing-base;
    padding: $spacing-base 0;
  }

  .user-card-avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
  }

  .user-card-avatar-placeholder {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: $color-gray-200;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $color-text-tertiary;
    flex-shrink: 0;
  }

  .user-card-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
  }

  .user-card-name {
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
  }

  .user-card-meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: $spacing-sm;
  }

  .user-card-date {
    display: flex;
    align-items: center;
    gap: $spacing-xs;
    font-size: $font-size-sm;
    color: $color-text-secondary;
  }

  .user-card-actions {
    display: flex;
    gap: $spacing-sm;
    margin-top: $spacing-sm;
    padding-top: $spacing-sm;
    border-top: 1px solid $color-border-primary;
  }

  .users__filters {
    margin-bottom: $spacing-lg;
  }
</style>
