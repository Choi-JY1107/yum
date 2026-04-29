<script lang="ts">
  import type { Restaurant } from '../domain/restaurant';

  interface Props {
    restaurant: Restaurant;
    dragOffset?: number;
    stackIndex?: number;
    isDragging?: boolean;
  }

  let { restaurant, dragOffset = 0, stackIndex = 0, isDragging = false }: Props = $props();

  const STACK_OFFSET_X_PX = 8;

  const isTop = $derived(stackIndex === 0);
  const stackOffsetX = $derived(stackIndex * STACK_OFFSET_X_PX);
  const tilt = $derived(isTop ? dragOffset / 20 : 0);
  const likeOpacity = $derived(isTop ? Math.max(0, Math.min(1, dragOffset / 100)) : 0);
  const passOpacity = $derived(isTop ? Math.max(0, Math.min(1, -dragOffset / 100)) : 0);
</script>

<article
  class="restaurant-card"
  class:restaurant-card--top={isTop}
  class:restaurant-card--dragging={isDragging}
  style="z-index: {10 - stackIndex}; transform: translateX({dragOffset +
    stackOffsetX}px) rotate({tilt}deg);"
>
  <div class="restaurant-card__media">
    {#if restaurant.imageUrl}
      <img
        class="restaurant-card__image"
        src={restaurant.imageUrl}
        alt={restaurant.name}
        draggable="false"
      />
    {:else}
      <div class="restaurant-card__placeholder" aria-hidden="true">🍽️</div>
    {/if}
    <span
      class="restaurant-card__stamp restaurant-card__stamp--like"
      style="opacity: {likeOpacity};"
      aria-hidden="true"
    >
      LIKE
    </span>
    <span
      class="restaurant-card__stamp restaurant-card__stamp--pass"
      style="opacity: {passOpacity};"
      aria-hidden="true"
    >
      PASS
    </span>
  </div>

  <div class="restaurant-card__body">
    <h2 class="restaurant-card__title">{restaurant.name}</h2>
    <p class="restaurant-card__meta">
      <span class="restaurant-card__category">{restaurant.category}</span>
      <span class="restaurant-card__dot" aria-hidden="true">·</span>
      <span class="restaurant-card__distance">{restaurant.distanceKm}km</span>
    </p>
    <p class="restaurant-card__menu">{restaurant.signatureMenu}</p>
  </div>
</article>

<style>
  .restaurant-card {
    position: absolute;
    inset: 0;
    background: var(--color-surface);
    border-radius: var(--radius-lg);
    box-shadow: 0 12px 32px var(--color-shadow);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    will-change: transform;
    user-select: none;
    transition: transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  .restaurant-card--top {
    cursor: grab;
  }

  .restaurant-card--dragging {
    transition: none;
    cursor: grabbing;
  }

  .restaurant-card__media {
    position: relative;
    flex: 1 1 auto;
    overflow: hidden;
    background: linear-gradient(135deg, #ffd9c2, #ffb199);
  }

  .restaurant-card__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .restaurant-card__placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 80px;
    opacity: 0.6;
  }

  .restaurant-card__stamp {
    position: absolute;
    top: var(--space-lg);
    padding: var(--space-sm) var(--space-md);
    border: 4px solid currentColor;
    border-radius: var(--radius-sm);
    font-size: var(--font-size-xl);
    font-weight: 800;
    letter-spacing: 0.1em;
    pointer-events: none;
    transition: opacity 0.1s linear;
  }

  .restaurant-card__stamp--like {
    right: var(--space-lg);
    color: var(--color-like);
    transform: rotate(12deg);
  }

  .restaurant-card__stamp--pass {
    left: var(--space-lg);
    color: var(--color-pass);
    transform: rotate(-12deg);
  }

  .restaurant-card__body {
    padding: var(--space-md) var(--space-lg) var(--space-lg);
    background: var(--color-surface);
  }

  .restaurant-card__title {
    margin: 0 0 var(--space-xs);
    font-size: var(--font-size-xl);
    font-weight: 700;
  }

  .restaurant-card__meta {
    margin: 0 0 var(--space-xs);
    color: var(--color-text-muted);
    font-size: var(--font-size-sm);
    display: flex;
    gap: var(--space-xs);
    align-items: center;
  }

  .restaurant-card__menu {
    margin: 0;
    font-size: var(--font-size-md);
    color: var(--color-text);
  }
</style>
