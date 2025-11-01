<script lang="ts">
  import { authStore } from '../stores/auth.store';
  import { apiService } from '../services/api.service';

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

<div class="register-container">
  <div class="register-card">
    <h1>Créer un compte</h1>
    <p class="subtitle">Rejoignez RecetteRanger et commencez à organiser vos recettes</p>

    {#if error}
      <div class="error-message">
        {error}
      </div>
    {/if}

    <form on:submit|preventDefault={handleRegister}>
      <div class="form-row">
        <div class="form-group">
          <label for="firstName">Prénom</label>
          <input
            id="firstName"
            type="text"
            bind:value={firstName}
            placeholder="John"
            disabled={isLoading}
            autocomplete="given-name"
          />
        </div>

        <div class="form-group">
          <label for="lastName">Nom</label>
          <input
            id="lastName"
            type="text"
            bind:value={lastName}
            placeholder="Doe"
            disabled={isLoading}
            autocomplete="family-name"
          />
        </div>
      </div>

      <div class="form-group">
        <label for="pseudo">Pseudo</label>
        <input
          id="pseudo"
          type="text"
          bind:value={pseudo}
          placeholder="john_doe"
          disabled={isLoading}
          autocomplete="username"
        />
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input
          id="email"
          type="email"
          bind:value={email}
          placeholder="john.doe@example.com"
          disabled={isLoading}
          autocomplete="email"
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
          autocomplete="new-password"
        />
        <small>Minimum 8 caractères</small>
      </div>

      <div class="form-group">
        <label for="confirmPassword">Confirmer le mot de passe</label>
        <input
          id="confirmPassword"
          type="password"
          bind:value={confirmPassword}
          placeholder="••••••••"
          disabled={isLoading}
          autocomplete="new-password"
        />
      </div>

      <button type="submit" class="btn-primary" disabled={isLoading}>
        {isLoading ? 'Création...' : 'Créer mon compte'}
      </button>
    </form>

    <div class="footer">
      <p>Vous avez déjà un compte ?</p>
      <button type="button" class="btn-secondary" on:click={goToLogin}>
        Se connecter
      </button>
    </div>
  </div>
</div>

<style>
  .register-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 1rem;
  }

  .register-card {
    background: white;
    border-radius: 12px;
    padding: 2.5rem;
    width: 100%;
    max-width: 500px;
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

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
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

  small {
    color: #888;
    font-size: 0.85rem;
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
