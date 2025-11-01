import { render as svelteRender } from 'svelte/server';
import App from './components/App.svelte';

export function render(props: any) {
  const result = svelteRender(App, { props });
  return result;
}

export default { render };
