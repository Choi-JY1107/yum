<script lang="ts">
  import { CATEGORIES, type Category } from '../domain/category';

  interface Props {
    selected: Category[];
    onToggle: (category: Category) => void;
    onClear: () => void;
  }

  let { selected, onToggle, onClear }: Props = $props();

  const isAnythingActive = $derived(selected.length === 0);
</script>

<div class="category-filter">
  <div class="category-filter__chips">
    {#each CATEGORIES as category (category)}
      <button
        type="button"
        class="category-filter__chip"
        class:category-filter__chip--active={selected.includes(category)}
        onclick={() => onToggle(category)}
      >
        {category}
      </button>
    {/each}
  </div>

  <div class="category-filter__row">
    <button
      type="button"
      class="category-filter__anything"
      class:category-filter__anything--active={isAnythingActive}
      onclick={onClear}
    >
      <span class="category-filter__anything-icon" aria-hidden="true">🎲</span>
      <span>아무거나 괜찮아요</span>
    </button>
    <button type="button" class="category-filter__clear" onclick={onClear}> 전체 해제 </button>
  </div>
</div>

<style>
  .category-filter {
    padding: 0 var(--space-md) var(--space-sm);
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
    align-items: center;
  }

  /* 3x2 그리드 — 가운데 정렬 */
  .category-filter__chips {
    display: grid;
    grid-template-columns: repeat(3, minmax(80px, 1fr));
    gap: var(--space-sm);
    width: 100%;
    max-width: 340px;
  }

  .category-filter__row {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
  }

  .category-filter__chip {
    padding: 8px 14px;
    background: var(--color-surface);
    border: 1px solid var(--color-pass);
    border-radius: 999px;
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
    cursor: pointer;
    transition:
      background 0.15s ease,
      color 0.15s ease,
      border-color 0.15s ease;
    white-space: nowrap;
    text-align: center;
  }

  .category-filter__chip:hover:not(.category-filter__chip--active) {
    border-color: var(--color-accent);
    color: var(--color-text);
  }

  .category-filter__chip--active {
    background: var(--color-accent);
    color: white;
    border-color: var(--color-accent);
    font-weight: 600;
  }

  /* "아무거나 괜찮아요" — 칩과 시각적으로 분리: 둥근 사각형 + 아이콘 + soft 배경 */
  .category-filter__anything {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    background: rgba(255, 255, 255, 0.6);
    border: 1.5px solid rgba(0, 0, 0, 0.08);
    border-radius: var(--radius-md);
    font-size: var(--font-size-sm);
    font-weight: 500;
    color: var(--color-text-muted);
    cursor: pointer;
    transition:
      background 0.15s ease,
      color 0.15s ease,
      border-color 0.15s ease;
  }

  .category-filter__anything:hover:not(.category-filter__anything--active) {
    border-color: var(--color-accent);
    color: var(--color-text);
  }

  .category-filter__anything--active {
    background: var(--color-accent);
    border-color: var(--color-accent);
    color: white;
    font-weight: 700;
    box-shadow: 0 4px 14px rgba(255, 122, 89, 0.35);
    transform: translateY(-1px);
  }

  .category-filter__anything-icon {
    font-size: 16px;
    line-height: 1;
  }

  .category-filter__clear {
    background: none;
    border: none;
    color: var(--color-text-muted);
    font-size: var(--font-size-sm);
    cursor: pointer;
    padding: 4px;
    text-decoration: underline;
  }

  .category-filter__clear:hover {
    color: var(--color-text);
  }
</style>
