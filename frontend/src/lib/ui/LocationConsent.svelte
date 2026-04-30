<script lang="ts">
  import type { Category } from '../domain/category';
  import CategoryFilter from './CategoryFilter.svelte';

  interface Props {
    onConsent: () => void;
    selectedCategories: Category[];
    onToggleCategory: (category: Category) => void;
    onClearCategories: () => void;
  }

  let { onConsent, selectedCategories, onToggleCategory, onClearCategories }: Props = $props();
</script>

<section class="location-consent">
  <div class="location-consent__hero">
    <div class="location-consent__icon" aria-hidden="true">📍</div>
    <h2 class="location-consent__title">근처 맛집을 찾아드릴게요</h2>
    <p class="location-consent__description">
      내 위치를 기반으로 가까운 식당을 골라드려요.<br />
      위치 정보는 검색에만 사용되고 저장되지 않아요.
    </p>
  </div>

  <div class="location-consent__filter">
    <p class="location-consent__filter-heading">오늘 뭐 먹고 싶어요?</p>
    <CategoryFilter
      selected={selectedCategories}
      onToggle={onToggleCategory}
      onClear={onClearCategories}
    />
  </div>

  <button type="button" class="location-consent__button" onclick={onConsent}>
    내 위치 사용하기
  </button>
</section>

<style>
  .location-consent {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: var(--space-lg);
    gap: var(--space-lg);
  }

  .location-consent__hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-sm);
  }

  .location-consent__icon {
    font-size: 56px;
    line-height: 1;
  }

  .location-consent__title {
    margin: 0;
    font-size: var(--font-size-xl);
    font-weight: 700;
  }

  .location-consent__description {
    margin: 0;
    color: var(--color-text-muted);
    font-size: var(--font-size-md);
    line-height: 1.6;
  }

  .location-consent__filter {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .location-consent__filter-heading {
    margin: 0;
    font-size: var(--font-size-md);
    font-weight: 600;
    color: var(--color-text);
    text-align: left;
    padding: 0 var(--space-md);
  }

  .location-consent__button {
    margin-top: var(--space-sm);
    padding: var(--space-md) var(--space-xl);
    background: var(--color-accent);
    color: white;
    border-radius: var(--radius-md);
    font-size: var(--font-size-md);
    font-weight: 600;
    box-shadow: 0 6px 18px var(--color-shadow);
    transition:
      transform 0.15s ease,
      box-shadow 0.15s ease;
  }

  .location-consent__button:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 24px var(--color-shadow);
  }

  .location-consent__button:active {
    transform: scale(0.97);
  }
</style>
