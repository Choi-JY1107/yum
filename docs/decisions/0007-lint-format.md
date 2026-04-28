# ADR-0007: Lint & Format — ESLint + Prettier

- **Status:** ✅ Accepted
- **Date:** 2026-04-28

## Context

Svelte 5 + TypeScript 코드의 일관성 유지가 필요하다. 사용자 요구: **Svelte 코드에 싹 다 적용**.

목표:
- 자동 포맷터로 스타일 논쟁 제거
- 정적 분석으로 명백한 오류 사전 차단
- 토이 프로젝트라 과한 룰셋은 피한다

## Decision

**ESLint(flat config) + Prettier**, Svelte/TS 플러그인 포함.

### 도구
| 도구 | 용도 |
| --- | --- |
| `eslint` 10.x | 정적 분석 (flat config) |
| `typescript-eslint` 8.x | TS 룰 |
| `eslint-plugin-svelte` 3.x | Svelte 컴포넌트 룰 |
| `prettier` 3.x | 포맷터 |
| `prettier-plugin-svelte` 3.x | Svelte 포맷 |
| `eslint-config-prettier` | ESLint↔Prettier 충돌 룰 비활성화 |

### Prettier 옵션 (`.prettierrc.json`)
- `singleQuote: true`, `semi: true`, `trailingComma: 'all'`
- `printWidth: 100`, `tabWidth: 2`
- 기존 코드 스타일에 맞춤 (변경 폭 최소화)

### ESLint 룰셋
- `js.configs.recommended` + `tseslint.configs.recommended` + `svelte.configs['flat/recommended']`
- Prettier 충돌 룰 끔 (`eslint-config-prettier` + `flat/prettier`)
- **strict 룰셋(`strict-type-checked` 등)은 도입 X** — 토이 프로젝트라 과함

### npm scripts
```
npm run lint           # ESLint 검사
npm run lint:fix       # ESLint 자동 수정
npm run format         # Prettier 적용
npm run format:check   # Prettier dry-run
```

### 적용 대상 / 제외
- 적용: `src/**/*.{ts,svelte,svelte.ts,css}`, 루트 설정 파일
- 제외: `dist/`, `node_modules/`, `mock/`, `public/`, `package-lock.json`

## Not Decided / Future

- **Pre-commit hook (husky + lint-staged)**: 토이 프로젝트라 일단 보류. 협업 시작하면 ADR로 재결정.
- **에디터 통합 (VS Code 등)**: 사용자 환경 개인 설정으로 위임.

## Consequences

**긍정적**
- 코드 스타일 일관성 자동 보장
- 새 기여자(나 자신 포함)가 스타일 고민 안 해도 됨
- CI/CD 도입 시 `npm run lint && npm run format:check`로 손쉽게 게이트 가능

**부정적**
- 의존성 8개 추가 (devDependencies)
- 설치·실행 시간 약간 증가 (체감 미미)

## References

- [eslint-plugin-svelte](https://sveltejs.github.io/eslint-plugin-svelte/)
- [Prettier Plugin Svelte](https://github.com/sveltejs/prettier-plugin-svelte)
- [typescript-eslint v8](https://typescript-eslint.io/)
