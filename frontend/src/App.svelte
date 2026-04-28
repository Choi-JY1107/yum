<script lang="ts">
  import './lib/styles/global.css';
  import LocationConsent from './lib/ui/LocationConsent.svelte';
  import LoadingScreen from './lib/ui/LoadingScreen.svelte';
  import ErrorScreen from './lib/ui/ErrorScreen.svelte';
  import SwipeDeck from './lib/ui/SwipeDeck.svelte';
  import { AppFlowStore } from './lib/application/app-flow.svelte';

  const flow = new AppFlowStore();
</script>

<header class="app-header">
  <h1 class="app-header__title">yum</h1>
</header>

<main class="app-main">
  {#if flow.phase === 'consent'}
    <LocationConsent onConsent={() => flow.grantLocation()} />
  {:else if flow.phase === 'loading'}
    <LoadingScreen />
  {:else if flow.phase === 'error'}
    <ErrorScreen
      message={flow.errorMessage ?? '알 수 없는 오류'}
      onRetry={() => flow.retry()}
    />
  {:else if flow.phase === 'ready' && flow.deck}
    <SwipeDeck store={flow.deck} />
  {/if}
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
