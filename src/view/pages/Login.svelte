<script lang="ts">
  import { authStore } from '../stores/auth.store';
  import { apiService } from '../services/api.service';

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

<div class="login-container">
  <div class="login-card">
    <h1>Connexion</h1>
    <p class="subtitle">Connectez-vous à votre compte RecetteRanger</p>

    {#if error}
      <div class="error-message">
        {error}
      </div>
    {/if}

    <form on:submit|preventDefault={handleLogin}>
      <div class="form-group">
        <label for="identifier">Email ou Pseudo</label>
        <input
          id="identifier"
          type="text"
          bind:value={identifier}
          placeholder="john.doe@example.com"
          disabled={isLoading}
          autocomplete="username"
        />
      </div>

      <div class="form-group">
        <label for="password">Mot de passe</label>
        <input
          id="password"
          type="password"
          bind:value={password}
          placeholder="••••••••"
          disabled={isLoading}
          autocomplete="current-password"
        />
      </div>

      <button type="submit" class="btn-primary" disabled={isLoading}>
        {isLoading ? 'Connexion...' : 'Se connecter'}
      </button>
    </form>

    <div class="footer">
      <p>Pas encore de compte ?</p>
      <button type="button" class="btn-secondary" on:click={goToRegister}>
        Créer un compte
      </button>
    </div>
  </div>
</div>

<style>
  .login-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

  form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  label {
    font-weight: 500;
    color: #333;
    font-size: 0.9rem;
  }

  input {
    padding: 0.75rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.2s;
  }

  input:focus {
    outline: none;
    border-color: #667eea;
  }

  input:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }

  .btn-primary,
  .btn-secondary {
    padding: 0.875rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    margin-top: 0.5rem;
  }

  .btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }

  .btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .btn-secondary {
    background: transparent;
    color: #667eea;
    border: 2px solid #667eea;
  }

  .btn-secondary:hover {
    background: #667eea;
    color: white;
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
