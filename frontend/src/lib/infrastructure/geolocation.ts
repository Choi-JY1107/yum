import type { Coordinates } from '../domain/location';

const TIMEOUT_MS = 10000;
const MAX_AGE_MS = 60000; // 1분 내 캐시된 위치 재사용 허용

export type GeolocationFailureReason =
  | 'unsupported' // navigator.geolocation 미존재 (오래된 브라우저, http)
  | 'permission-denied'
  | 'unavailable' // OS·네트워크 문제
  | 'timeout';

export class GeolocationError extends Error {
  readonly reason: GeolocationFailureReason;

  constructor(reason: GeolocationFailureReason) {
    super(reason);
    this.reason = reason;
    this.name = 'GeolocationError';
  }
}

export async function getCurrentLocation(): Promise<Coordinates> {
  if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
    throw new GeolocationError('unsupported');
  }

  return new Promise<Coordinates>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject(new GeolocationError('permission-denied'));
            break;
          case error.POSITION_UNAVAILABLE:
            reject(new GeolocationError('unavailable'));
            break;
          case error.TIMEOUT:
            reject(new GeolocationError('timeout'));
            break;
          default:
            reject(new GeolocationError('unavailable'));
        }
      },
      {
        enableHighAccuracy: false, // 식당 검색은 GPS 정밀도 불필요
        timeout: TIMEOUT_MS,
        maximumAge: MAX_AGE_MS,
      },
    );
  });
}
