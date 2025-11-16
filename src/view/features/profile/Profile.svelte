<script lang="ts">
  import { onMount } from 'svelte';
  import Layout from '../../layouts/Layout.svelte';
  import { Input, Button, PageHero, PasswordInput, Card, Badge, Link, AuthorLink } from '../../components/ui';
  import { ImageUpload } from '../../components/ui';
  import { apiService } from '../../services/api.service';
  import { authStore } from '../../stores/auth.store';
  import { User, Clock, Flame, Carrot, ArrowRight } from 'lucide-svelte';

  let {
    user: initialUser = null,
    profileUserId = null,
    isOwnProfile = true,
    isAdminEditing = false,
    profileUser: initialProfileUser = null
  }: {
    user?: any,
    profileUserId?: string | null,
    isOwnProfile?: boolean,
    isAdminEditing?: boolean,
    profileUser?: any
  } = $props();

  let profileUser = $state<any>(null);
  let loading = $state(false);
  let error = $state('');
  let success = $state('');

  // États du formulaire (uniquement pour mon profil)
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

  let passwordError = $state('');
  let passwordSuccess = $state('');

  let userRecipes = $state<any[]>([]);

  onMount(async () => {
    // Si c'est mon profil, utiliser initialUser
    if (isOwnProfile && initialUser) {
      profileUser = initialUser;
      formData = {
        pseudo: initialUser.pseudo,
        firstName: initialUser.firstName,
        lastName: initialUser.lastName,
        email: initialUser.email,
        avatarUrl: initialUser.avatarUrl || ''
      };
    } else if (isAdminEditing && initialProfileUser) {
      // Admin édite un utilisateur
      profileUser = initialProfileUser;
      formData = {
        pseudo: initialProfileUser.pseudo,
        firstName: initialProfileUser.firstName,
        lastName: initialProfileUser.lastName,
        email: initialProfileUser.email,
        avatarUrl: initialProfileUser.avatarUrl || ''
      };
    } else if (profileUserId) {
      // Sinon charger le profil public de l'utilisateur
      await loadPublicProfile(profileUserId);
      await loadUserRecipes(profileUserId);
    }
  });

  async function loadPublicProfile(userId: string) {
    loading = true;
    error = '';

    try {
      const response = await fetch(`http://localhost:3000/api/users/${userId}/public`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Erreur lors du chargement du profil');
      }

      profileUser = await response.json();
    } catch (err: any) {
      error = err.message || 'Erreur lors du chargement du profil';
    } finally {
      loading = false;
    }
  }

  async function loadUserRecipes(userId: string) {
    try {
      const response = await fetch(`http://localhost:3000/api/users/${userId}/recipes`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des recettes');
      }

      userRecipes = await response.json();
    } catch (err: any) {
      console.error('Erreur lors du chargement des recettes:', err);
      userRecipes = [];
    }
  }

  async function handleUpdateProfile() {
    loading = true;
    error = '';
    success = '';

    try {
      const userId = isAdminEditing ? profileUser.id : initialUser.id;
      const updateData = {
        pseudo: formData.pseudo,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        avatarUrl: formData.avatarUrl || null
      };

      console.log('[Profile.handleUpdateProfile] Updating user:', userId);
      console.log('[Profile.handleUpdateProfile] isAdminEditing:', isAdminEditing);
      console.log('[Profile.handleUpdateProfile] formData.avatarUrl:', formData.avatarUrl);
      console.log('[Profile.handleUpdateProfile] updateData:', updateData);

      const updatedUser = await apiService.updateUser(userId, updateData);

      console.log('[Profile.handleUpdateProfile] Response from API:', updatedUser);
      console.log('[Profile.handleUpdateProfile] updatedUser.avatarUrl:', updatedUser.avatarUrl);

      // Mettre à jour le store auth uniquement si c'est mon propre profil
      if (isOwnProfile) {
        authStore.updateUser(updatedUser);
      }
      profileUser = updatedUser;

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

  function goToRecipes() {
    window.location.href = `/recettes?ownerId=${profileUser.id}`;
  }

  function formatTime(minutes: number): string {
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h${mins}min` : `${hours}h`;
  }
</script>

<Layout title={isOwnProfile ? "Mon Profil" : isAdminEditing ? `Édition - ${profileUser?.pseudo || 'Utilisateur'}` : `Profil de ${profileUser?.pseudo || 'Utilisateur'}`} currentPage={isAdminEditing ? "/users" : "/profile"} user={initialUser}>
  <div class="profile">
    {#if loading && !profileUser}
      <div class="profile__loading">Chargement...</div>
    {:else if error && !profileUser}
      <div class="profile__error">{error}</div>
    {:else if profileUser}
      {#if isOwnProfile}
        <PageHero
          title="Mon Profil"
          subtitle="Gérez vos informations personnelles"
        />
      {:else if isAdminEditing}
        <PageHero
          title={`Édition - ${profileUser.pseudo}`}
          subtitle="Modifier les informations de l'utilisateur"
        />
      {/if}

      {#if isOwnProfile || isAdminEditing}
        <!-- Mode Édition : Mon profil -->
        <div class="profile__content">
          <!-- Section Informations Personnelles -->
          <section class="profile__section">
            <h2 class="profile__section-title">Informations personnelles</h2>

            {#if error}
              <div class="profile__message profile__message--error">{error}</div>
            {/if}

            {#if success}
              <div class="profile__message profile__message--success">{success}</div>
            {/if}

            <div class="profile__form-layout">
              <!-- Avatar à gauche -->
              <div class="profile__avatar-section">
                <label class="profile__label">Photo de profil</label>
                <ImageUpload
                  value={formData.avatarUrl}
                  onUpload={handleImageUpload}
                  aspectRatio={1}
                  cropShape="circle"
                />
              </div>

              <!-- Champs à droite -->
              <div class="profile__fields-section">
                <!-- Pseudo -->
                <div class="profile__field">
                  <Input
                    id="pseudo"
                    label="Pseudo"
                    bind:value={formData.pseudo}
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

                <div class="profile__actions">
                  <Button onclick={handleUpdateProfile} disabled={loading}>
                    {loading ? 'Mise à jour...' : 'Mettre à jour le profil'}
                  </Button>
                </div>
              </div>
            </div>
          </section>

          <!-- Section Changement de Mot de Passe -->
          <section class="profile__section">
            <h2 class="profile__section-title">Changer le mot de passe</h2>

            {#if passwordError}
              <div class="profile__message profile__message--error">{passwordError}</div>
            {/if}

            {#if passwordSuccess}
              <div class="profile__message profile__message--success">{passwordSuccess}</div>
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

              <div class="profile__actions profile__actions--right">
                <Button onclick={handleChangePassword} disabled={loading}>
                  {loading ? 'Changement...' : 'Changer le mot de passe'}
                </Button>
              </div>
            </div>
          </section>
        </div>
      {:else}
        <!-- Mode Public : Profil d'un autre utilisateur -->
        <PageHero title={profileUser.pseudo}>
          {#snippet children()}
            <div class="profile__public-hero">
              <div class="profile__public-left">
                {#if profileUser.avatarUrl}
                  <img src={profileUser.avatarUrl} alt={profileUser.pseudo} class="profile__public-avatar" />
                {:else}
                  <div class="profile__public-avatar-placeholder">
                    <User size={80} />
                  </div>
                {/if}

                <p class="profile__public-member">
                  Membre depuis {new Date(profileUser.createdAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })}
                </p>
              </div>

              <div class="profile__public-right">
                <Link href={`/recettes?ownerId=${profileUser.id}`} variant="inverse">
                  Voir toutes ses recettes
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          {/snippet}
        </PageHero>

        <!-- Recettes récentes -->
        {#if userRecipes.length > 0}
          <div class="profile__recipes">
            <h2 class="profile__recipes-title">Recettes récentes</h2>
            <div class="profile__recipes-grid">
              {#each userRecipes as recipe (recipe.id)}
                <Card
                  title={recipe.label}
                  subtitle={recipe.description}
                  imageUrl={recipe.imageUrl}
                  imagePlaceholder="🍽️"
                  clickable={true}
                  onclick={() => window.location.href = `/recettes/${recipe.id}`}
                >
                  {#snippet footer()}
                    <div class="recipe-card-footer">
                      <div class="recipe-card-info">
                        {#if recipe.prepMinutes > 0}
                          <Badge variant="neutral" size="xs">
                            <Clock size={14} /> {formatTime(recipe.prepMinutes)}
                          </Badge>
                        {/if}
                        {#if recipe.cookMinutes > 0}
                          <Badge variant="neutral" size="xs">
                            <Flame size={14} /> {formatTime(recipe.cookMinutes)}
                          </Badge>
                        {/if}
                        {#if recipe.ingredients?.length > 0}
                          <Badge variant="neutral" size="xs">
                            <Carrot size={14} /> {recipe.ingredients.length} ingr.
                          </Badge>
                        {/if}
                      </div>
                    </div>
                  {/snippet}
                </Card>
              {/each}
            </div>
          </div>
        {:else}
          <div class="profile__no-recipes">
            <p>Cet utilisateur n'a pas encore de recettes publiques.</p>
          </div>
        {/if}
      {/if}
    {/if}
  </div>
</Layout>

<style lang="scss">
  @use '../../styles/variables' as *;
  @use 'sass:color';

  $primary-color: $brand-primary;
  $secondary-color: $brand-secondary;
  $success-color: $color-success;
  $danger-color: $color-danger;
  $white: $color-white;
  $text-dark: $color-gray-800;
  $text-gray: $color-gray-600;
  $border-color: $color-gray-200;
  $shadow-light: $color-black-alpha-08;
  $spacing-base: 1rem;

  .profile {
    display: flex;
    flex-direction: column;
    gap: $spacing-base * 2;

    &__loading,
    &__error {
      text-align: center;
      padding: $spacing-base * 4;
      color: $text-gray;
      font-size: 1.2rem;
    }

    &__error {
      color: $danger-color;
    }

    &__content {
      display: grid;
      grid-template-columns: 1fr;
      gap: $spacing-base * 3;
      width: 100%;

      @media (min-width: 1536px) {
        grid-template-columns: 1fr 1fr;
      }
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

    &__message {
      padding: $spacing-base;
      border-radius: 8px;
      margin-bottom: $spacing-base;

      &--error {
        background: $color-background-danger;
        border: 1px solid $danger-color;
        color: $danger-color;
      }

      &--success {
        background: $color-background-success;
        border: 1px solid $success-color;
        color: color.adjust($success-color, $lightness: -20%);
      }
    }

    &__form-layout {
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: $spacing-base * 3;
      align-items: start;

      @media (max-width: 968px) {
        grid-template-columns: 1fr;
      }
    }

    &__avatar-section {
      display: flex;
      flex-direction: column;
      gap: $spacing-base;
    }

    &__fields-section {
      display: flex;
      flex-direction: column;
      gap: $spacing-base * 1.5;
    }

    &__fields-row {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: $spacing-base * 1.5;

      @media (max-width: 1280px) {
        grid-template-columns: 1fr;
      }
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
      display: flex;
      justify-content: flex-end;
      gap: $spacing-base;
      margin-top: $spacing-base;

      &--right {
        grid-column: 1 / -1;
        justify-content: flex-end;
      }
    }

    // Styles pour le profil public
    &__public-hero {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: $spacing-base * 2;

      @media (max-width: 768px) {
        flex-direction: column;
        text-align: center;
      }
    }

    &__public-left {
      display: flex;
      align-items: center;
      gap: $spacing-base * 2;

      @media (max-width: 768px) {
        flex-direction: column;
      }
    }

    &__public-right {
      display: flex;
      align-items: center;

      :global(.link) {
        text-shadow: none !important;
        text-transform: none !important;
      }
    }

    &__public-avatar {
      width: 180px;
      height: 180px;
      border-radius: 50%;
      object-fit: cover;
      border: 4px solid $color-white;
      flex-shrink: 0;
    }

    &__public-avatar-placeholder {
      width: 180px;
      height: 180px;
      border-radius: 50%;
      background: rgba($color-white, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      color: $color-white;
      border: 4px solid $color-white;
      flex-shrink: 0;
    }

    &__public-member {
      font-size: 1rem;
      color: $color-white-alpha-90;
      margin: 0;
    }

    &__recipes {
      margin-top: $spacing-base * 2;
    }

    &__recipes-title {
      font-size: 1.75rem;
      font-weight: 600;
      color: $text-dark;
      margin: 0 0 $spacing-base * 1.5 0;
    }

    &__recipes-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: $spacing-base * 1.5;

      @media (min-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
      }

      @media (min-width: 1280px) {
        grid-template-columns: repeat(3, 1fr);
      }

      @media (min-width: 1920px) {
        grid-template-columns: repeat(4, 1fr);
      }
    }

    &__no-recipes {
      text-align: center;
      padding: $spacing-base * 4;
      color: $text-gray;
      font-size: 1.1rem;
      background: $white;
      border-radius: 12px;
      margin-top: $spacing-base * 2;
    }
  }

  .recipe-card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: $spacing-base;
  }

  .recipe-card-info {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-xs;
  }
</style>
