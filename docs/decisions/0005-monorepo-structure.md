# ADR-0005: 모노레포 디렉토리 구조 (frontend/backend 분리)

- **Status:** ✅ Accepted
- **Date:** 2026-04-28

## Context

프론트엔드(Svelte + Vite)와 백엔드(Go 또는 Node.js, 미정)가 **분리된 런타임**이다. 한 저장소 안에서 두 코드를 어떻게 배치할지 결정 필요.

## Options

| 후보 | 장점 | 단점 |
| --- | --- | --- |
| 단일 디렉토리 (루트에 프론트만) | 단순 | 백엔드 추가 시 경로 충돌·재구조화 비용 |
| **모노레포 (`frontend/`, `backend/`)** | 명확한 경계, 각자 독립 빌드 | 디렉토리 한 단계 깊어짐 |
| 멀티 저장소 (저장소 분리) | 완전 독립 | 토이 프로젝트엔 과도, 동기화 비용 |

## Decision

**모노레포 — `frontend/`, `backend/` 두 디렉토리로 분리.**

```
yum/
├── CLAUDE.md
├── prototype.png
├── docs/                  # 프로젝트 전체 문서
├── frontend/              # Svelte 5 + Vite + TS (이번 단계)
│   ├── src/
│   ├── package.json
│   └── ...
└── backend/               # 이후 단계 (Go 또는 Node.js, ADR 예정)
    └── ...
```

## Consequences

**긍정적**
- 프론트/백엔드 의존성·빌드 도구가 충돌하지 않음
- 각 영역의 README·테스트 등을 자기 디렉토리에 둘 수 있음
- 향후 CI/CD 분리도 자연스러움

**부정적**
- 명령어 실행 시 `cd frontend` 필요 (Makefile 또는 스크립트로 완화 가능)
- 공통 패키지가 생기면 워크스페이스(npm workspaces 등) 도입 검토 필요 — 그 시점에 ADR로 결정
