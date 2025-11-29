<script lang="ts">
  let { title = 'RecetteRanger', message = 'Bienvenue!' }: { title?: string; message?: string } = $props();

  let count = $state(0);

  function increment() {
    count += 1;
  }
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<main>
  <div class="container">
    <h1>{title}</h1>
    <p class="message">{message}</p>

    <div class="counter">
      <p>Compteur (pour tester l'hydration): <strong>{count}</strong></p>
      <button on:click={increment}>Incrémenter</button>
    </div>

    <div class="info">
      <h2>Fonctionnalités</h2>
      <ul>
        <li>✅ NestJS Backend</li>
        <li>✅ Svelte Frontend</li>
        <li>✅ Server-Side Rendering (SSR)</li>
        <li>✅ Hydration côté client</li>
        <li>✅ Sans SvelteKit</li>
      </ul>
    </div>
  </div>
</main>

<style lang="scss">
  @use '../styles/global' as *;

  :global(body) {
    background: $brand-primary;
  }

  main {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 2rem;
  }

  .container {
    background: white;
    border-radius: 16px;
    padding: 3rem;
    max-width: 600px;
    box-shadow: 0 20px 60px $color-black-alpha-30;
  }

  h1 {
    color: $brand-primary;
    font-size: 3rem;
    margin: 0 0 1rem 0;
    text-align: center;
  }

  .message {
    text-align: center;
    font-size: 1.25rem;
    color: $color-gray-500;
    margin-bottom: 2rem;
  }

  .counter {
    background: $color-gray-100;
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 2rem;
    text-align: center;
  }

  .counter p {
    margin: 0 0 1rem 0;
    font-size: 1.1rem;
  }

  .counter strong {
    color: $brand-primary;
    font-size: 1.5rem;
  }

  button {
    background: $brand-primary;
    color: white;
    border: none;
    padding: 0.75rem 2rem;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  button:hover {
    background: $brand-quaternary;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px $color-primary-alpha-40;
  }

  button:active {
    transform: translateY(0);
  }

  .info {
    border-top: 2px solid $color-gray-100;
    padding-top: 1.5rem;
  }

  .info h2 {
    color: $color-gray-800;
    font-size: 1.5rem;
    margin: 0 0 1rem 0;
  }

  .info ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .info li {
    padding: 0.5rem 0;
    font-size: 1.1rem;
    color: $color-gray-600;
  }
</style>
