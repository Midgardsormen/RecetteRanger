<script lang="ts">
  import { onMount } from 'svelte';
  import Layout from '../../layouts/Layout.svelte';
  import { Input, Button, Title, PasswordInput } from '../../components/ui';
  import { ImageUpload } from '../../components/ui';
  import { apiService } from '../../services/api.service';
  import { authStore } from '../../stores/auth.store';

  let { user: initialUser = null }: { user?: any } = $props();

  // États du formulaire
  let formData = $state({
    pseudo: '',
    firstName: '',
    lastName: '',
    email: '',
    avatarUrl: ''
  });

  let passwordData = $state({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  let loading = $state(false);
  let error = $state('');
  let success = $state('');
  let passwordError = $state('');
  let passwordSuccess = $state('');

  onMount(() => {
    if (initialUser) {
      formData = {
        pseudo: initialUser.pseudo,
        firstName: initialUser.firstName,
        lastName: initialUser.lastName,
        email: initialUser.email,
        avatarUrl: initialUser.avatarUrl || ''
      };
    }
  });

  async function handleUpdateProfile() {
    loading = true;
    error = '';
    success = '';

    try {
      const updatedUser = await apiService.updateUser(initialUser.id, {
        pseudo: formData.pseudo,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        avatarUrl: formData.avatarUrl || null
      });

      // Mettre à jour le store auth
      authStore.updateUser(updatedUser);

      success = 'Profil mis à jour avec succès !';

      // Effacer le message après 3 secondes
      setTimeout(() => {
        success = '';
      }, 3000);
    } catch (err: any) {
      error = err.message || 'Erreur lors de la mise à jour du profil';
    } finally {
      loading = false;
    }
  }

  async function handleChangePassword() {
    passwordError = '';
    passwordSuccess = '';

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      passwordError = 'Les nouveaux mots de passe ne correspondent pas';
      return;
    }

    if (passwordData.newPassword.length < 6) {
      passwordError = 'Le mot de passe doit contenir au moins 6 caractères';
      return;
    }

    loading = true;

    try {
      await apiService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword
      });

      passwordSuccess = 'Mot de passe modifié avec succès !';

      // Réinitialiser les champs
      passwordData = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      };

      // Effacer le message après 3 secondes
      setTimeout(() => {
        passwordSuccess = '';
      }, 3000);
    } catch (err: any) {
      passwordError = err.message || 'Erreur lors du changement de mot de passe';
    } finally {
      loading = false;
    }
  }

  function handleImageUpload(url: string) {
    formData.avatarUrl = url;
  }
</script>

<Layout title="Mon Profil" currentPage="/profile" user={initialUser}>
  <div class="profile">
    <header class="profile__header">
      <Title level={1}>👤 Mon Profil</Title>
    </header>

    <div class="profile__content">
      <!-- Section Informations Personnelles -->
      <section class="profile__section">
        <h2 class="profile__section-title">Informations personnelles</h2>

        {#if error}
          <div class="profile__error">{error}</div>
        {/if}

        {#if success}
          <div class="profile__success">{success}</div>
        {/if}

        <div class="profile__form">
          <!-- Avatar -->
          <div class="profile__field profile__field--full">
            <label class="profile__label">Photo de profil</label>
            <ImageUpload
              value={formData.avatarUrl}
              onUpload={handleImageUpload}
              aspectRatio={1}
              cropShape="circle"
            />
          </div>

          <!-- Pseudo -->
          <div class="profile__field">
            <Input
              id="pseudo"
              label="Pseudo"
              bind:value={formData.pseudo}
              required
            />
          </div>

          <!-- Prénom -->
          <div class="profile__field">
            <Input
              id="firstName"
              label="Prénom"
              bind:value={formData.firstName}
              required
            />
          </div>

          <!-- Nom -->
          <div class="profile__field">
            <Input
              id="lastName"
              label="Nom"
              bind:value={formData.lastName}
              required
            />
          </div>

          <!-- Email -->
          <div class="profile__field">
            <Input
              id="email"
              label="Email"
              type="email"
              bind:value={formData.email}
              required
            />
          </div>

          <div class="profile__actions">
            <Button onclick={handleUpdateProfile} disabled={loading}>
              {loading ? 'Mise à jour...' : 'Mettre à jour le profil'}
            </Button>
          </div>
        </div>
      </section>

      <!-- Section Changement de Mot de Passe -->
      <section class="profile__section">
        <h2 class="profile__section-title">Changer le mot de passe</h2>

        {#if passwordError}
          <div class="profile__error">{passwordError}</div>
        {/if}

        {#if passwordSuccess}
          <div class="profile__success">{passwordSuccess}</div>
        {/if}

        <div class="profile__form">
          <!-- Mot de passe actuel -->
          <div class="profile__field profile__field--full">
            <PasswordInput
              id="currentPassword"
              label="Mot de passe actuel"
              bind:value={passwordData.currentPassword}
              required
            />
          </div>

          <!-- Nouveau mot de passe -->
          <div class="profile__field">
            <PasswordInput
              id="newPassword"
              label="Nouveau mot de passe"
              bind:value={passwordData.newPassword}
              required
            />
          </div>

          <!-- Confirmation -->
          <div class="profile__field">
            <PasswordInput
              id="confirmPassword"
              label="Confirmer le mot de passe"
              bind:value={passwordData.confirmPassword}
              required
            />
          </div>

          <div class="profile__actions">
            <Button onclick={handleChangePassword} disabled={loading}>
              {loading ? 'Changement...' : 'Changer le mot de passe'}
            </Button>
          </div>
        </div>
      </section>
    </div>
  </div>
</Layout>

<style lang="scss">
  $primary-color: #667eea;
  $secondary-color: #764ba2;
  $success-color: #48bb78;
  $danger-color: #f56565;
  $white: #fff;
  $text-dark: #333;
  $text-gray: #666;
  $border-color: #e0e0e0;
  $shadow-light: rgba(0, 0, 0, 0.08);
  $spacing-base: 1rem;

  .profile {
    display: flex;
    flex-direction: column;
    gap: $spacing-base * 2;
    max-width: 1000px;
    margin: 0 auto;

    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: $spacing-base;
    }

    &__content {
      display: flex;
      flex-direction: column;
      gap: $spacing-base * 3;
    }

    &__section {
      background: $white;
      border-radius: 12px;
      padding: $spacing-base * 2;
      box-shadow: 0 2px 12px $shadow-light;
    }

    &__section-title {
      margin: 0 0 $spacing-base * 1.5 0;
      font-size: 1.5rem;
      color: $text-dark;
      border-bottom: 2px solid $border-color;
      padding-bottom: $spacing-base;
    }

    &__error {
      padding: $spacing-base;
      background: #fee;
      border: 1px solid $danger-color;
      border-radius: 8px;
      color: $danger-color;
      margin-bottom: $spacing-base;
    }

    &__success {
      padding: $spacing-base;
      background: #e6ffed;
      border: 1px solid $success-color;
      border-radius: 8px;
      color: darken($success-color, 20%);
      margin-bottom: $spacing-base;
    }

    &__form {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: $spacing-base * 1.5;

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    }

    &__field {
      &--full {
        grid-column: 1 / -1;
      }
    }

    &__label {
      display: block;
      margin-bottom: $spacing-base * 0.5;
      font-weight: 600;
      color: $text-dark;
    }

    &__actions {
      grid-column: 1 / -1;
      display: flex;
      justify-content: flex-end;
      gap: $spacing-base;
      margin-top: $spacing-base;
    }
  }
</style>
