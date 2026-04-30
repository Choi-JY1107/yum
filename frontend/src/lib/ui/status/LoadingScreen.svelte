<script lang="ts">
  interface Props {
    message?: string;
  }

  let { message = '맛집을 찾고 있어요…' }: Props = $props();
</script>

<section class="loading-screen">
  <div class="loading-screen__spinner" aria-hidden="true"></div>
  <p class="loading-screen__message">{message}</p>
</section>

<style>
  .loading-screen {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--space-md);
  }

  .loading-screen__spinner {
    width: 36px;
    height: 36px;
    border: 3px solid var(--color-pass);
    border-top-color: var(--color-accent);
    border-radius: 50%;
    animation: loading-screen__spin 0.8s linear infinite;
  }

  .loading-screen__message {
    margin: 0;
    color: var(--color-text-muted);
    font-size: var(--font-size-sm);
  }

  @keyframes loading-screen__spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
