// 장난스러운 mock 데이터 (실데이터 호출 실패 fallback).
// 사진은 이모지 SVG 데이터 URI — 추후 개발자가 그린 그림이나 사진으로 대체 예정.
// 메뉴/카테고리는 의도적으로 가짜임이 드러나는 텍스트.

function emojiImage(emoji: string, bgHex: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="#${bgHex}"/><text x="100" y="155" text-anchor="middle" font-size="150">${emoji}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const response = {
  restaurants: [
    {
      id: 'mock-001',
      name: '공사중 분식',
      category: '준비중',
      imageUrl: emojiImage('🚧', 'fff4e6'),
      distanceKm: 0.1,
      signatureMenu: '잠시 후 이용 부탁드립니다',
    },
    {
      id: 'mock-002',
      name: '도그푸딩 라멘',
      category: '개발자 픽',
      imageUrl: emojiImage('🍜', 'ffe8d6'),
      distanceKm: 0.2,
      signatureMenu: '저는 아침에 일어나서 가장 먼저 그날 뭐 먹을지 생각합니다',
    },
    {
      id: 'mock-003',
      name: 'Hello, World 카페',
      category: '데뷔작',
      imageUrl: emojiImage('☕', 'ede0d4'),
      distanceKm: 0.3,
      signatureMenu: '첫 출시 메뉴 — 잘 부탁드려요',
    },
    {
      id: 'mock-004',
      name: '404 식당',
      category: 'Not Found',
      imageUrl: emojiImage('🤖', 'e3f2fd'),
      distanceKm: 0.4,
      signatureMenu: '이 식당은 존재하지 않습니다',
    },
    {
      id: 'mock-005',
      name: 'TODO 비빔밥',
      category: '구현 예정',
      imageUrl: emojiImage('🍚', 'fff9c4'),
      distanceKm: 0.5,
      signatureMenu: '여기에 진짜 메뉴가 들어갈 거예요',
    },
    {
      id: 'mock-006',
      name: '디버그 떡볶이',
      category: '개발자 모드',
      imageUrl: emojiImage('🌶️', 'ffcdd2'),
      distanceKm: 0.6,
      signatureMenu: '이 떡볶이는 console.log 맛입니다',
    },
    {
      id: 'mock-007',
      name: '프로토타입 카츠',
      category: '베타',
      imageUrl: emojiImage('🥩', 'efebe9'),
      distanceKm: 0.7,
      signatureMenu: '지금은 이모지지만 곧 진짜 사진이 될 거예요',
    },
    {
      id: 'mock-008',
      name: 'Stack Overflow 죽',
      category: 'FAQ',
      imageUrl: emojiImage('🍲', 'f1f8e9'),
      distanceKm: 0.8,
      signatureMenu: '오늘 점심 추천 → 베스트 답변: 아무거나',
    },
    {
      id: 'mock-009',
      name: 'Lorem Ipsum 피자',
      category: '더미',
      imageUrl: emojiImage('🍕', 'fff3e0'),
      distanceKm: 0.9,
      signatureMenu: 'Lorem ipsum dolor sit amet — 토마토 듬뿍',
    },
    {
      id: 'mock-010',
      name: "git commit -m 'food'",
      category: '버전 관리',
      imageUrl: emojiImage('🥡', 'e8f5e9'),
      distanceKm: 1.0,
      signatureMenu: 'feat: 배고픔 해소 기능 추가',
    },
  ],
};
