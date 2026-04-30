<script lang="ts">
  import type { ResponseMeta } from '../../domain/api-contract';
  import type { GeolocationFailureReason } from '../../infrastructure/geolocation';
  import LocationFallbackBanner from './LocationFallbackBanner.svelte';
  import MockDataBanner from './MockDataBanner.svelte';

  interface Props {
    meta: ResponseMeta | null;
    usedFallbackLocation: boolean;
    locationFallbackReason: GeolocationFailureReason | null;
  }

  let { meta, usedFallbackLocation, locationFallbackReason }: Props = $props();
</script>

{#if usedFallbackLocation}
  <LocationFallbackBanner reason={locationFallbackReason} />
{/if}
{#if meta?.restaurantSource === 'mock'}
  <MockDataBanner />
{/if}
