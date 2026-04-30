export const CATEGORIES = ['한식', '중식', '일식', '양식', '분식', '패스트푸드'] as const;

export type Category = (typeof CATEGORIES)[number];
