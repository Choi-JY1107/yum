# Lint & Format 사용법

> 결정 근거: [ADR-0007](../decisions/0007-lint-format.md)

## TL;DR
```bash
cd frontend
npm run format    # 모든 파일 자동 포맷
npm run lint:fix  # ESLint 자동 수정 가능한 항목 수정
npm run lint      # ESLint 검사만
npm run check     # TypeScript + Svelte 타입 체크
```

## 언제 돌리나
- **코드 작성 후 커밋 전**: `npm run format && npm run lint`
- **문제 디버깅**: `npm run check`로 타입 오류 먼저
- CI/CD 도입 시: `npm run lint && npm run format:check && npm run check && npm run build`

## 핵심 룰
- **포맷팅은 Prettier가 결정한다** — 들여쓰기·줄바꿈·따옴표 등 스타일 논쟁 X
- **ESLint는 명백한 오류만 잡는다** — strict 룰셋 미적용 (토이 프로젝트 단계)
- **충돌 시 Prettier 우선** — `eslint-config-prettier`로 ESLint 스타일 룰을 끔

## 설정 파일
| 파일 | 역할 |
| --- | --- |
| `frontend/eslint.config.js` | ESLint flat config |
| `frontend/.prettierrc.json` | Prettier 옵션 |
| `frontend/.prettierignore` | Prettier 제외 경로 |

## BEM과의 관계
- BEM은 **CSS 클래스 명명**이라 Prettier/ESLint와 충돌 없음
- BEM 규칙 검증은 [bem.md](./bem.md)에서 사람이 본다 (자동화는 향후 검토)

## 룰 추가/완화
- 새 룰을 도입하려면 `eslint.config.js` 수정 + ADR로 근거를 남긴다
- 자동 포맷 결과가 마음에 안 들면 `.prettierrc.json` 수정 후 `npm run format` 재실행
