<script lang="ts">
  import Layout from '../../layouts/Layout.svelte';
  import { authStore } from '../../stores/auth.store';
  import { derived } from 'svelte/store';
  import { Landing, Dashboard } from './components';

  // Recevoir les données du SSR
  let { user: ssrUser = null }: { user?: any } = $props();

  // Créer un store dérivé pour l'authentification et l'utilisateur
  const authState = derived(authStore, ($auth) => ({
    isAuthenticated: ssrUser ? true : $auth.isAuthenticated,
    user: ssrUser || $auth.user
  }));
</script>

<Layout title="Home" currentPage="/" user={$authState.user}>
  <div id="home" class="home">
    {#if $authState.isAuthenticated && $authState.user}
      <!-- Utilisateur connecté - Dashboard -->
      <Dashboard user={$authState.user} />
    {:else}
      <!-- Utilisateur non connecté - Landing Page -->
      <Landing />
    {/if}
  </div>
</Layout>

<style lang="scss">
  .home {
    display: flex;
    flex-direction: column;
  }
</style>
