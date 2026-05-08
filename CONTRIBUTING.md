# Shape Run 협업 가이드

이 문서는 Shape Run 팀원이 같은 기준으로 작업하기 위한 최소 규칙입니다.

## 작업 흐름

1. `main` 브랜치는 항상 실행 가능한 상태로 유지합니다.
2. 개인 작업은 원본 저장소를 직접 수정하지 않고 fork 저장소에서 진행합니다.
3. 기능 작업은 fork 저장소의 새 브랜치에서 진행합니다.
4. 작업 완료 후 원본 저장소의 `main` 브랜치로 PR을 생성합니다.
5. PR에는 상대 팀원 2명을 리뷰어로 지정합니다.
6. 본인이 올린 PR을 직접 머지하지 않습니다.
7. PR 머지 전에는 충돌 해결, 타입 체크, 린트 확인을 완료합니다.

## Fork 작업 흐름

처음 한 번만 원본 저장소를 fork합니다.

```bash
git clone https://github.com/내깃허브아이디/INHA_DB_RunningPlatform.git
cd INHA_DB_RunningPlatform
git remote add upstream https://github.com/alpacapacaaa/INHA_DB_RunningPlatform.git
```

작업 시작 전에는 원본 저장소의 최신 내용을 가져옵니다.

```bash
git switch main
git pull upstream main
git push origin main
```

기능 브랜치를 만들고 작업합니다.

```bash
git switch -c feature/course-detail
```

작업 후 fork 저장소로 push하고 GitHub에서 PR을 생성합니다.

```bash
git push origin feature/course-detail
```

## 브랜치 규칙

브랜치명은 아래 형식을 사용합니다.

```text
feature/작업-내용
fix/수정-내용
docs/문서-내용
chore/설정-내용
```

예시:

```text
feature/course-detail
fix/gps-distance-format
docs/development-guide
chore/mobile-lint
```

## 커밋 규칙

커밋 메시지는 [커밋 컨벤션](./docs/COMMIT_CONVENTION.md)을 따릅니다.

```text
feat: 코스 상세 화면 추가
fix: 거리 소수점 표시 오류 수정
docs: 모바일 실행 방법 정리
```

커밋 컨벤션을 지키지 않은 커밋은 PR에서 수정 요청을 받을 수 있습니다.

## PR 규칙

PR 작성 기준은 [PR 규칙](./docs/PULL_REQUEST_RULE.md)을 따릅니다.

PR에는 아래 내용을 반드시 포함합니다.

- 어떤 작업을 했는지
- 실행 또는 확인 방법
- UI 변경이 있으면 스크린샷
- 백엔드 API 변경이 있으면 요청/응답 예시

## DB 및 코드 네이밍 규칙

DB와 코드 네이밍은 [네이밍 규칙](./docs/NAMING_CONVENTION.md)을 따릅니다.

- Java, TypeScript 변수와 객체 필드는 `camelCase`를 사용합니다.
- DB 테이블명과 컬럼명은 `snake_case`를 사용합니다.
- API JSON 응답 필드는 프론트 사용성을 위해 `camelCase`를 기본으로 합니다.

## 확인 명령어

모바일 앱:

```bash
cd mobile
npm run typecheck
npm run lint
```

백엔드:

```bash
cd backend
./gradlew test
```

Windows에서는 `backend/gradlew.bat test`를 사용합니다.
