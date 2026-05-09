<script lang="ts">
  import type { Restaurant } from '../../domain/restaurant';

  interface Props {
    restaurants: Restaurant[];
    onSearchAgain: () => void;
    onRemove: (id: string) => void;
  }

  let { restaurants, onSearchAgain, onRemove }: Props = $props();

  // 편집 모드: ON일 때만 카드 흔들리고 삭제 버튼 노출
  let editMode = $state(false);
</script>

<section class="kept-list">
  <header class="kept-list__header">
    <p class="kept-list__count">총 {restaurants.length}곳</p>
    {#if restaurants.length > 0}
      <button
        type="button"
        class="kept-list__edit-toggle"
        class:kept-list__edit-toggle--active={editMode}
        onclick={() => (editMode = !editMode)}
      >
        {editMode ? '완료' : '편집'}
      </button>
    {/if}
  </header>

  {#if restaurants.length === 0}
    <p class="kept-list__empty">킵한 식당이 없어요</p>
  {:else}
    <ul class="kept-list__items">
      {#each restaurants as r (r.id)}
        <li class="kept-list__item" class:kept-list__item--editing={editMode}>
          {#if editMode}
            <button
              type="button"
              class="kept-list__remove"
              aria-label={`${r.name} 삭제`}
              onclick={() => onRemove(r.id)}
            >
              −
            </button>
          {/if}
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
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .kept-list__count {
    margin: 0;
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
  }

  .kept-list__edit-toggle {
    background: var(--color-surface);
    border: 1px solid var(--color-pass);
    color: var(--color-accent);
    font-size: var(--font-size-sm);
    font-weight: 500;
    cursor: pointer;
    padding: 6px 14px;
    border-radius: 999px;
    box-shadow: 0 2px 6px var(--color-shadow);
    transition: box-shadow 0.15s ease;
  }

  .kept-list__edit-toggle:hover {
    box-shadow: 0 3px 10px var(--color-shadow);
  }

  .kept-list__edit-toggle--active {
    font-weight: 700;
  }

  .kept-list__empty {
    text-align: center;
    color: var(--color-text-muted);
    font-size: var(--font-size-md);
    margin: var(--space-xl) 0;
  }

  /* minmax(0, 1fr): 1fr 단독은 min-content까지 늘어나서 50/50이 깨짐 */
  .kept-list__items {
    list-style: none;
    margin: 0;
    padding: var(--space-xs) var(--space-xs) 0;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--space-md);
  }

  .kept-list__item {
    position: relative;
    background: var(--color-surface);
    border-radius: var(--radius-md);
    box-shadow: 0 2px 8px var(--color-shadow);
    transform-origin: center;
    min-width: 0;
  }

  /* 편집 모드일 때만 jiggle */
  .kept-list__item--editing {
    animation: kept-list__jiggle-a 0.42s ease-in-out infinite;
  }

  .kept-list__item--editing:nth-child(even) {
    animation-name: kept-list__jiggle-b;
    animation-delay: -0.21s;
  }

  @keyframes kept-list__jiggle-a {
    0%,
    100% {
      transform: rotate(-0.7deg);
    }
    50% {
      transform: rotate(0.7deg);
    }
  }

  @keyframes kept-list__jiggle-b {
    0%,
    100% {
      transform: rotate(0.7deg);
    }
    50% {
      transform: rotate(-0.7deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .kept-list__item--editing,
    .kept-list__item--editing:nth-child(even) {
      animation: none;
    }
  }

  .kept-list__remove {
    position: absolute;
    top: -8px;
    right: -8px;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: #ef5350;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid white;
    cursor: pointer;
    font-size: 18px;
    font-weight: 700;
    line-height: 1;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    z-index: 2;
    padding: 0;
  }

  .kept-list__remove:hover {
    background: #d32f2f;
  }

  .kept-list__remove:active {
    transform: scale(0.92);
  }

  .kept-list__media {
    width: 100%;
    aspect-ratio: 1;
    border-radius: var(--radius-md) var(--radius-md) 0 0;
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
    font-size: 36px;
    opacity: 0.6;
  }

  .kept-list__info {
    padding: var(--space-sm);
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  .kept-list__name {
    margin: 0;
    font-size: var(--font-size-sm);
    font-weight: 700;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .kept-list__meta {
    margin: 0;
    color: var(--color-text-muted);
    font-size: 12px;
    display: flex;
    gap: var(--space-xs);
  }

  .kept-list__footer {
    margin-top: auto;
    display: flex;
    justify-content: center;
    padding-top: var(--space-md);
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
