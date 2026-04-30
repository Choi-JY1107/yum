<script lang="ts">
  import { usePan, type PanCustomEvent } from 'svelte-gestures';
  import RestaurantCard from './RestaurantCard.svelte';
  import ActionButtons from './ActionButtons.svelte';
  import type { SwipeDeckStore } from '../../application/swipe-deck.svelte';
  import { SWIPE_THRESHOLD_PX, type SwipeDirection } from '../../domain/swipe';

  interface Props {
    store: SwipeDeckStore;
    loadingMore?: boolean;
  }

  let { store, loadingMore = false }: Props = $props();

  let dragX = $state(0);
  let isDragging = $state(false);
  let isAnimating = $state(false);
  let panStartX: number | null = null;

  function handlePan(event: PanCustomEvent): void {
    if (isAnimating || store.isFinished) return;
    if (panStartX === null) {
      panStartX = event.detail.x;
      isDragging = true;
      return;
    }
    dragX = event.detail.x - panStartX;
  }

  function handlePanUp(): void {
    if (panStartX === null) return;
    panStartX = null;
    isDragging = false;
    if (Math.abs(dragX) > SWIPE_THRESHOLD_PX) {
      flingAndSwipe(dragX > 0 ? 'right' : 'left');
    } else {
      dragX = 0;
    }
  }

  function flingAndSwipe(direction: SwipeDirection) {
    isAnimating = true;
    dragX = direction === 'right' ? window.innerWidth : -window.innerWidth;
    setTimeout(() => {
      store.swipe(direction);
      dragX = 0;
      isAnimating = false;
    }, 280);
  }

  function pass(): void {
    if (isAnimating || store.isFinished) return;
    flingAndSwipe('left');
  }

  function like(): void {
    if (isAnimating || store.isFinished) return;
    flingAndSwipe('right');
  }
</script>

<section class="swipe-deck">
  <div class="swipe-deck__stage">
    {#if store.isFinished}
      <div class="swipe-deck__empty">
        {#if loadingMore}
          <div class="swipe-deck__empty-spinner" aria-hidden="true"></div>
          <p class="swipe-deck__empty-title">더 찾는 중…</p>
        {:else}
          <p class="swipe-deck__empty-title">오늘의 후보를 다 봤어요</p>
          <p class="swipe-deck__empty-meta">킵한 가게 {store.likedIds.length}곳</p>
          <button type="button" class="swipe-deck__reset" onclick={() => store.reset()}>
            다시 시작
          </button>
        {/if}
      </div>
    {:else}
      <div
        class="swipe-deck__hit-area"
        {...usePan(handlePan, () => ({ delay: 0, touchAction: 'none' }), { onpanup: handlePanUp })}
      >
        {#each store.visibleStack as restaurant, stackIndex (restaurant.id)}
          <RestaurantCard
            {restaurant}
            {stackIndex}
            dragOffset={stackIndex === 0 ? dragX : 0}
            isDragging={stackIndex === 0 ? isDragging : false}
          />
        {/each}
      </div>
    {/if}
  </div>
  <ActionButtons onPass={pass} onLike={like} disabled={store.isFinished || isAnimating} />
</section>

<style>
  .swipe-deck {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: var(--space-md);
    gap: var(--space-md);
  }

  .swipe-deck__stage {
    position: relative;
    flex: 1;
    aspect-ratio: 3 / 4;
    max-height: 70vh;
    margin: 0 auto;
    width: 100%;
  }

  .swipe-deck__hit-area {
    position: absolute;
    inset: 0;
    touch-action: none;
  }

  .swipe-deck__empty {
    position: absolute;
    inset: 0;
    background: var(--color-surface);
    border-radius: var(--radius-lg);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: 0 12px 32px var(--color-shadow);
    text-align: center;
    padding: var(--space-lg);
  }

  .swipe-deck__empty-title {
    font-size: var(--font-size-lg);
    font-weight: 700;
    margin: 0 0 var(--space-sm);
  }

  .swipe-deck__empty-meta {
    color: var(--color-text-muted);
    margin: 0 0 var(--space-lg);
  }

  .swipe-deck__reset {
    padding: var(--space-sm) var(--space-lg);
    background: var(--color-accent);
    color: white;
    border-radius: var(--radius-md);
    font-weight: 600;
  }

  .swipe-deck__empty-spinner {
    width: 32px;
    height: 32px;
    border: 3px solid var(--color-pass);
    border-top-color: var(--color-accent);
    border-radius: 50%;
    margin-bottom: var(--space-md);
    animation: swipe-deck__spin 0.8s linear infinite;
  }

  @keyframes swipe-deck__spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
