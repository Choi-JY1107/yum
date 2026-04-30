<script lang="ts">
  import type { Restaurant } from '../../domain/restaurant';

  interface Props {
    restaurants: Restaurant[];
    onSearchAgain: () => void;
  }

  let { restaurants, onSearchAgain }: Props = $props();
</script>

<section class="kept-list">
  <header class="kept-list__header">
    <h2 class="kept-list__title">킵한 식당 {restaurants.length}곳</h2>
  </header>

  {#if restaurants.length === 0}
    <p class="kept-list__empty">킵한 식당이 없어요</p>
  {:else}
    <ul class="kept-list__items">
      {#each restaurants as r (r.id)}
        <li class="kept-list__item">
          <div class="kept-list__media">
            {#if r.imageUrl}
              <img class="kept-list__image" src={r.imageUrl} alt={r.name} />
            {:else}
              <div class="kept-list__placeholder" aria-hidden="true">🍽️</div>
            {/if}
          </div>
          <div class="kept-list__info">
            <h3 class="kept-list__name">{r.name}</h3>
            <p class="kept-list__meta">
              <span>{r.category}</span>
              <span aria-hidden="true">·</span>
              <span>{r.distanceKm}km</span>
            </p>
            <p class="kept-list__menu">{r.signatureMenu}</p>
          </div>
        </li>
      {/each}
    </ul>
  {/if}

  <div class="kept-list__footer">
    <button type="button" class="kept-list__action" onclick={onSearchAgain}> 다시 찾기 </button>
  </div>
</section>

<style>
  .kept-list {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: var(--space-md);
    gap: var(--space-md);
    overflow-y: auto;
  }

  .kept-list__header {
    text-align: center;
  }

  .kept-list__title {
    margin: 0;
    font-size: var(--font-size-lg);
    font-weight: 700;
  }

  .kept-list__empty {
    text-align: center;
    color: var(--color-text-muted);
    font-size: var(--font-size-md);
    margin: var(--space-xl) 0;
  }

  .kept-list__items {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .kept-list__item {
    display: flex;
    gap: var(--space-md);
    padding: var(--space-sm);
    background: var(--color-surface);
    border-radius: var(--radius-md);
    box-shadow: 0 2px 8px var(--color-shadow);
  }

  .kept-list__media {
    flex-shrink: 0;
    width: 72px;
    height: 72px;
    border-radius: var(--radius-sm);
    overflow: hidden;
    background: linear-gradient(135deg, #ffd9c2, #ffb199);
  }

  .kept-list__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .kept-list__placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    opacity: 0.6;
  }

  .kept-list__info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 2px;
  }

  .kept-list__name {
    margin: 0;
    font-size: var(--font-size-md);
    font-weight: 700;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .kept-list__meta {
    margin: 0;
    color: var(--color-text-muted);
    font-size: var(--font-size-sm);
    display: flex;
    gap: var(--space-xs);
  }

  .kept-list__menu {
    margin: 0;
    font-size: var(--font-size-sm);
    color: var(--color-text);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .kept-list__footer {
    margin-top: auto;
    display: flex;
    justify-content: center;
  }

  .kept-list__action {
    padding: var(--space-md) var(--space-xl);
    background: var(--color-accent);
    color: white;
    border-radius: var(--radius-md);
    font-size: var(--font-size-md);
    font-weight: 600;
    box-shadow: 0 6px 18px var(--color-shadow);
    cursor: pointer;
    transition:
      transform 0.15s ease,
      box-shadow 0.15s ease;
  }

  .kept-list__action:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 24px var(--color-shadow);
  }

  .kept-list__action:active {
    transform: scale(0.97);
  }
</style>
