<script lang="ts">
  import { authStore } from '../../stores/auth.store';
  import { apiService } from '../../services/api.service';
  import { Input, Button } from '../../components/ui';
  import PasswordInput from '../../components/ui/form/PasswordInput.svelte';

  let pseudo = '';
  let firstName = '';
  let lastName = '';
  let email = '';
  let password = '';
  let confirmPassword = '';
  let error = '';
  let isLoading = false;

  async function handleRegister() {
    // Validation
    if (!pseudo || !firstName || !lastName || !email || !password || !confirmPassword) {
      error = 'Veuillez remplir tous les champs';
      return;
    }

    if (password !== confirmPassword) {
      error = 'Les mots de passe ne correspondent pas';
      return;
    }

    if (password.length < 8) {
      error = 'Le mot de passe doit contenir au moins 8 caractères';
      return;
    }

    isLoading = true;
    error = '';

    try {
      const response = await apiService.register({
        pseudo,
        firstName,
        lastName,
        email,
        password,
      });

      // Le token est maintenant dans un cookie HTTP-only, on stocke juste l'utilisateur
      authStore.login(response.user);

      // Rediriger vers la page d'accueil
      window.location.href = '/';
    } catch (err) {
      error = err instanceof Error ? err.message : 'Une erreur est survenue';
    } finally {
      isLoading = false;
    }
  }

  function goToLogin() {
    window.location.href = '/login';
  }
</script>

<div id="register" class="register-container">
  <div class="register-card">
    <h1>Créer un compte</h1>
    <p class="subtitle">Rejoignez RecetteRanger et commencez à organiser vos recettes</p>

    {#if error}
      <div class="error-message">
        {error}
      </div>
    {/if}

    <form on:submit|preventDefault={handleRegister} class="register-form">
      <div class="form-row">
        <Input
          id="firstName"
          type="text"
          label="Prénom"
          bind:value={firstName}
          placeholder="John"
          disabled={isLoading}
          required
        />

        <Input
          id="lastName"
          type="text"
          label="Nom"
          bind:value={lastName}
          placeholder="Doe"
          disabled={isLoading}
          required
        />
      </div>

      <Input
        id="pseudo"
        type="text"
        label="Pseudo"
        bind:value={pseudo}
        placeholder="john_doe"
        disabled={isLoading}
        required
      />

      <Input
        id="email"
        type="email"
        label="Email"
        bind:value={email}
        placeholder="john.doe@example.com"
        disabled={isLoading}
        required
      />

      <PasswordInput
        id="password"
        label="Mot de passe"
        bind:value={password}
        placeholder="••••••••"
        disabled={isLoading}
        hint="Minimum 8 caractères"
        required
      />

      <PasswordInput
        id="confirmPassword"
        label="Confirmer le mot de passe"
        bind:value={confirmPassword}
        placeholder="••••••••"
        disabled={isLoading}
        required
      />

      <Button type="submit" fullWidth disabled={isLoading}>
        {isLoading ? 'Création...' : 'Créer mon compte'}
      </Button>
    </form>

    <div class="footer">
      <p>Vous avez déjà un compte ?</p>
      <Button variant="outlined" fullWidth onclick={goToLogin}>
        Se connecter
      </Button>
    </div>
  </div>
</div>

<style lang="scss">
  @use '../../styles/variables' as *;

  .register-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: $spacing-base;
    @include retro-grain(0.3);
    background: $brand-quaternary;
    background-image: url('/assets/images/ChatGPT Image 11 nov. 2025, 00_10_06.png');
    background-size: cover;
    background-position: center;
    background-blend-mode: overlay;
    position: relative;

    // Overlay pour contrôler l'opacité de l'image
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: $brand-quaternary;
      opacity: 0.85;
      z-index: 0;
    }
  }

  .register-card {
    position: relative;
    z-index: 1;
    background: $brand-cream;
    border-radius: $radius-2xl;
    padding: $spacing-2xl;
    width: 100%;
    max-width: 500px;
    box-shadow: 0 4px 20px rgba($brand-primary, 0.3);

    @media (min-width: $breakpoint-md) {
      padding: $spacing-3xl;
    }
  }

  h1 {
    text-transform: uppercase;
    font-family: $font-family-heading;
    font-weight: $font-weight-bold;
    color: $brand-primary;
    font-size: $title-size-1;
    margin: 0 0 $spacing-sm 0;
    text-align: center;
  }

  .subtitle {
    color: $color-text-secondary;
    margin: 0 0 $spacing-2xl 0;
    font-size: $font-size-base;
    text-align: center;
  }

  .error-message {
    background: $color-background-danger;
    border: 1px solid $color-danger-light;
    color: $color-danger-dark;
    padding: $spacing-md;
    border-radius: $radius-md;
    margin-bottom: $spacing-lg;
    font-size: $font-size-sm;
  }

  .register-form {
    display: flex;
    flex-direction: column;
    gap: $spacing-lg;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $spacing-base;
  }

  .footer {
    margin-top: $spacing-2xl;
    text-align: center;
  }

  .footer p {
    color: $color-text-secondary;
    margin: 0 0 $spacing-base 0;
    font-size: $font-size-sm;
  }
</style>
