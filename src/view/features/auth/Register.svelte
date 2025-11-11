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
      <Button variant="secondary" fullWidth onclick={goToLogin}>
        Se connecter
      </Button>
    </div>
  </div>
</div>

<style>
  .register-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #667eea;
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

  .register-form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
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
