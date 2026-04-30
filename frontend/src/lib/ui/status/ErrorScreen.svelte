<script lang="ts">
  interface Props {
    message: string;
    onRetry: () => void;
  }

  let { message, onRetry }: Props = $props();
</script>

<section class="error-screen">
  <div class="error-screen__icon" aria-hidden="true">😢</div>
  <h2 class="error-screen__title">잠시 문제가 생겼어요</h2>
  <p class="error-screen__message">{message}</p>
  <button type="button" class="error-screen__retry" onclick={onRetry}>다시 시도</button>
</section>

<style>
  .error-screen {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: var(--space-xl) var(--space-lg);
    gap: var(--space-md);
  }

  .error-screen__icon {
    font-size: 56px;
    line-height: 1;
  }

  .error-screen__title {
    margin: 0;
    font-size: var(--font-size-lg);
    font-weight: 700;
  }

  .error-screen__message {
    margin: 0;
    color: var(--color-text-muted);
    font-size: var(--font-size-sm);
  }

  .error-screen__retry {
    margin-top: var(--space-md);
    padding: var(--space-sm) var(--space-lg);
    background: var(--color-accent);
    color: white;
    border-radius: var(--radius-md);
    font-weight: 600;
  }
</style>
