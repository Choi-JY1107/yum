export interface Restaurant {
  readonly id: string;
  readonly name: string;
  readonly category: string;
  readonly imageUrl: string;
  readonly distanceKm: number;
  readonly signatureMenu: string;
}
