<script lang="ts">
  interface Props {
    onPass: () => void;
    onLike: () => void;
    disabled?: boolean;
  }

  let { onPass, onLike, disabled = false }: Props = $props();
</script>

<div class="action-buttons">
  <button
    type="button"
    class="action-buttons__button action-buttons__button--pass"
    aria-label="패스"
    {disabled}
    onclick={onPass}
  >
    ✕
  </button>
  <button
    type="button"
    class="action-buttons__button action-buttons__button--like"
    aria-label="킵"
    {disabled}
    onclick={onLike}
  >
    ♥
  </button>
</div>

<style>
  .action-buttons {
    display: flex;
    justify-content: center;
    gap: var(--space-xl);
    padding: var(--space-lg) 0;
  }

  .action-buttons__button {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: var(--color-surface);
    box-shadow: 0 6px 18px var(--color-shadow);
    font-size: 28px;
    font-weight: 700;
    transition:
      transform 0.15s ease,
      box-shadow 0.15s ease;
  }

  .action-buttons__button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 24px var(--color-shadow);
  }

  .action-buttons__button:active:not(:disabled) {
    transform: scale(0.95);
  }

  .action-buttons__button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .action-buttons__button--pass {
    color: var(--color-pass);
  }

  .action-buttons__button--like {
    color: var(--color-like);
  }
</style>
