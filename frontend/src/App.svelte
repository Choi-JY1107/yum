<script lang="ts">
  import './lib/styles/global.css';
  import SwipeDeck from './lib/ui/SwipeDeck.svelte';
  import { SwipeDeckStore } from './lib/application/swipe-deck.svelte';
  import { dummyRestaurants } from './lib/infrastructure/restaurants.dummy';

  const store = new SwipeDeckStore(dummyRestaurants);
</script>

<header class="app-header">
  <h1 class="app-header__title">yum</h1>
</header>

<main class="app-main">
  <SwipeDeck {store} />
</main>

<style>
  .app-header {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-md) 0;
  }

  .app-header__title {
    margin: 0;
    font-size: var(--font-size-xl);
    font-weight: 800;
    color: var(--color-accent);
    letter-spacing: -0.02em;
  }

  .app-main {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
</style>
