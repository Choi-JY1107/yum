<script lang="ts">
  import type { GeolocationFailureReason } from '../infrastructure/geolocation';

  interface Props {
    reason?: GeolocationFailureReason | null;
  }

  let { reason }: Props = $props();

  const message = $derived.by(() => {
    switch (reason) {
      case 'permission-denied':
        return '위치 권한 거부됨 — 마곡 기본 위치로 검색 중';
      case 'unavailable':
        return '위치 정보 사용 불가 — 마곡 기본 위치로 검색 중';
      case 'timeout':
        return '위치 가져오기 시간 초과 — 마곡 기본 위치로 검색 중';
      case 'unsupported':
        return '브라우저가 위치 기능 미지원 — 마곡 기본 위치로 검색 중';
      default:
        return '내 위치를 못 가져왔어요 — 마곡 기본 위치로 검색 중';
    }
  });
</script>

<aside class="location-banner" role="status">
  <span class="location-banner__icon" aria-hidden="true">📍</span>
  <span class="location-banner__text">{message}</span>
</aside>

<style>
  .location-banner {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    margin: 0 var(--space-md) var(--space-sm);
    padding: var(--space-sm) var(--space-md);
    background: #e3f2fd;
    border: 1px solid #90caf9;
    border-radius: var(--radius-md);
    font-size: var(--font-size-sm);
    color: #1565c0;
  }

  .location-banner__icon {
    font-size: 16px;
    flex-shrink: 0;
  }

  .location-banner__text {
    flex: 1;
    line-height: 1.4;
  }
</style>
