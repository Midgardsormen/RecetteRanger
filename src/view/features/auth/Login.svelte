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
      <Button variant="secondary" fullWidth onclick={goToRegister}>
        Créer un compte
      </Button>
    </div>
  </div>
</div>

<style>
  .login-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #667eea;
    padding: 1rem;
  }

  .login-card {
    background: white;
    border-radius: 12px;
    padding: 2.5rem;
    width: 100%;
    max-width: 420px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  }

  h1 {
    font-size: 2rem;
    margin: 0 0 0.5rem 0;
    color: #333;
  }

  .subtitle {
    color: #666;
    margin: 0 0 2rem 0;
    font-size: 0.95rem;
  }

  .error-message {
    background: #fee;
    border: 1px solid #fcc;
    color: #c33;
    padding: 0.75rem;
    border-radius: 6px;
    margin-bottom: 1.5rem;
    font-size: 0.9rem;
  }

  .login-form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .footer {
    margin-top: 2rem;
    text-align: center;
  }

  .footer p {
    color: #666;
    margin: 0 0 1rem 0;
    font-size: 0.9rem;
  }
</style>
