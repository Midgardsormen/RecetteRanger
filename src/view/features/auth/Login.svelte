<script lang="ts">
  import { authStore } from '../../stores/auth.store';
  import { apiService } from '../../services/api.service';
  import { Input, Button } from '../../components/ui';
  import PasswordInput from '../../components/ui/form/PasswordInput.svelte';

  let identifier = '';
  let password = '';
  let error = '';
  let isLoading = false;

  async function handleLogin() {
    if (!identifier || !password) {
      error = 'Veuillez remplir tous les champs';
      return;
    }

    isLoading = true;
    error = '';

    try {
      const response = await apiService.login({ identifier, password });
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

  function goToRegister() {
    window.location.href = '/register';
  }
</script>

<div id="login" class="login-container">
  <div class="login-card">
    <h1>Connexion</h1>
    <p class="subtitle">Connectez-vous à votre compte RecetteRanger</p>

    {#if error}
      <div class="error-message">
        {error}
      </div>
    {/if}

    <form on:submit|preventDefault={handleLogin} class="login-form">
      <Input
        id="identifier"
        type="text"
        label="Email ou Pseudo"
        bind:value={identifier}
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
        required
      />

      <Button type="submit" fullWidth disabled={isLoading}>
        {isLoading ? 'Connexion...' : 'Se connecter'}
      </Button>
    </form>

    <div class="footer">
      <p>Pas encore de compte ?</p>
      <Button variant="outlined" fullWidth onclick={goToRegister}>
        Créer un compte
      </Button>
    </div>
  </div>
</div>

<style lang="scss">
  @use '../../styles/variables' as *;

  .login-container {
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

  .login-card {
    position: relative;
    z-index: 1;
    background: $color-dutch-white;
    border-radius: $radius-2xl;
    padding: $spacing-2xl;
    width: 100%;
    max-width: 420px;
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

  .login-form {
    display: flex;
    flex-direction: column;
    gap: $spacing-lg;
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
