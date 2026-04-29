<script lang="ts">
  import './lib/styles/global.css';
  import LocationConsent from './lib/ui/LocationConsent.svelte';
  import LoadingScreen from './lib/ui/LoadingScreen.svelte';
  import ErrorScreen from './lib/ui/ErrorScreen.svelte';
  import MockDataBanner from './lib/ui/MockDataBanner.svelte';
  import LocationFallbackBanner from './lib/ui/LocationFallbackBanner.svelte';
  import SwipeDeck from './lib/ui/SwipeDeck.svelte';
  import { AppFlowStore } from './lib/application/app-flow.svelte';

  const flow = new AppFlowStore();

  const PREFETCH_THRESHOLD = 3;

  // 카드 잔량이 임계값 이하 + 더 받을 수 있으면 백그라운드 prefetch
  $effect(() => {
    if (
      flow.phase === 'ready' &&
      flow.deck &&
      flow.deck.remaining <= PREFETCH_THRESHOLD &&
      flow.meta?.hasMore &&
      !flow.loadingMore
    ) {
      void flow.loadMore();
    }
  });
</script>

<header class="app-header">
  <h1 class="app-header__title">yum</h1>
  {#if flow.phase === 'ready' && flow.deck && !flow.deck.isFinished}
    <button
      type="button"
      class="app-header__pill"
      aria-label="그만하기 — 지금까지 킵한 식당 보기"
      onclick={() => flow.deck?.finishEarly()}
    >
      <span class="app-header__pill-icon" aria-hidden="true">♥</span>
      <span class="app-header__pill-count">{flow.deck.likedIds.length}</span>
      <span class="app-header__pill-label">그만하기</span>
    </button>
  {/if}
</header>

<main class="app-main">
  {#if flow.phase === 'consent'}
    <LocationConsent onConsent={() => flow.grantLocation()} />
  {:else if flow.phase === 'loading'}
    <LoadingScreen />
  {:else if flow.phase === 'error'}
    <ErrorScreen message={flow.errorMessage ?? '알 수 없는 오류'} onRetry={() => flow.retry()} />
  {:else if flow.phase === 'ready' && flow.deck}
    {#if flow.usedFallbackLocation}
      <LocationFallbackBanner reason={flow.locationFallbackReason} />
    {/if}
    {#if flow.meta?.restaurantSource === 'mock'}
      <MockDataBanner />
    {/if}
    <SwipeDeck store={flow.deck} loadingMore={flow.loadingMore} />
  {/if}
</main>

<style>
  .app-header {
    position: relative;
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

  .app-header__pill {
    position: absolute;
    right: var(--space-md);
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    padding: 6px 12px;
    background: var(--color-surface);
    border: 1px solid var(--color-pass);
    border-radius: 999px;
    font-size: var(--font-size-sm);
    color: var(--color-text);
    cursor: pointer;
    box-shadow: 0 2px 8px var(--color-shadow);
    transition:
      transform 0.12s ease,
      box-shadow 0.12s ease;
  }

  .app-header__pill:hover {
    box-shadow: 0 4px 12px var(--color-shadow);
  }

  .app-header__pill:active {
    transform: translateY(-50%) scale(0.96);
  }

  .app-header__pill-icon {
    color: var(--color-like);
    font-size: 14px;
  }

  .app-header__pill-count {
    font-weight: 700;
    color: var(--color-like);
    min-width: 12px;
    text-align: center;
  }

  .app-header__pill-label {
    color: var(--color-text-muted);
    font-size: 12px;
  }

  .app-main {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
</style>
