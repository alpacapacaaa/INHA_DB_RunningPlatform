# Shape Run 협업 가이드
이 문서는 팀원이 동일한 기준으로 개발할 수 있도록 협업 규칙, 실행 방법, 개발 환경을 정리한 문서입니다.

---

# 1. 저장소 구조

```text
mobile/   : Expo 기반 모바일 애플리케이션
backend/  : Spring Boot 기반 백엔드 애플리케이션
.github/  : GitHub 협업 및 CI 자동화 설정
```

---

# 2. 기본 협업 흐름

1. `main` 브랜치는 항상 실행 가능한 상태로 유지합니다.
2. 개인 작업은 원본 저장소를 직접 수정하지 않고 fork 저장소에서 진행합니다.
3. 기능 작업은 fork 저장소의 새 브랜치에서 진행합니다.
4. 작업 완료 후 원본 저장소의 `main` 브랜치로 PR을 생성합니다.
5. PR에는 상대 팀원 2명을 리뷰어로 지정합니다.
6. 본인이 올린 PR은 직접 머지하지 않습니다.
7. PR 머지 전에는 충돌 해결, 린트, 타입 체크, 테스트 확인을 완료합니다.

---

# 3. Fork 적용 방법

GitHub에서 원본 저장소를 fork한 뒤, 자신의 fork 저장소를 clone합니다.

```bash
git clone https://github.com/내깃허브아이디/INHA_DB_RunningPlatform.git
cd INHA_DB_RunningPlatform

git remote add upstream https://github.com/alpacapacaaa/INHA_DB_RunningPlatform.git
```

작업 시작 전에는 항상 원본 저장소의 최신 내용을 가져옵니다.

```bash
git switch main
git pull upstream main
git push origin main
```

새 작업 브랜치를 생성합니다.

```bash
git switch -c feature/course-detail
```

작업 완료 후 자신의 fork 저장소로 push합니다.

```bash
git push origin feature/course-detail
```

이후 GitHub에서 원본 저장소의 `main` 브랜치로 PR을 생성합니다.

---

# 4. 브랜치 규칙

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

---

# 5. 커밋 컨벤션

커밋 메시지는 아래 형식을 사용합니다.

```text
type: 변경 내용 요약
```

사용 가능한 타입:

- `feat` : 새로운 기능 추가
- `fix` : 버그 수정
- `docs` : 문서 수정
- `style` : 포맷팅 등 동작과 무관한 수정
- `refactor` : 기능 변화 없는 구조 개선
- `test` : 테스트 추가 또는 수정
- `chore` : 설정, 패키지, 빌드 관련 수정
- `remove` : 파일 또는 코드 삭제
- `rename` : 파일명 또는 폴더명 변경

예시:

```text
feat: 코스 상세 화면 추가
fix: GPS 거리 계산 오류 수정
docs: Expo 실행 방법 정리
chore: 모바일 lint 설정 추가
remove: 사용하지 않는 frontend 삭제
```

---

# 6. PR 규칙

PR 제목도 커밋 컨벤션과 동일한 형식을 사용합니다.

예시:

```text
feat: 코스 상세 화면 추가
fix: 러닝 완료 화면 기록 표시 수정
docs: 개발 환경 설정 정리
```

PR에는 아래 내용을 포함합니다.

- 어떤 작업을 했는지
- 실행 또는 확인 방법
- UI 변경이 있으면 스크린샷
- 백엔드 API 변경이 있으면 요청/응답 예시

머지 전 확인 사항:

- 상대 팀원 2명을 리뷰어로 지정합니다.
- 리뷰 확인 전에는 머지하지 않습니다.
- 본인이 올린 PR은 직접 머지하지 않습니다.
- 내 작업과 관련 없는 파일이 포함되지 않았는지 확인합니다.
- 변경 후 루트에서 `npm run check`를 실행합니다.

---

# 7. GitHub 자동화 설정

프로젝트에는 GitHub 협업 및 CI 자동화를 위한 `.github` 설정이 포함되어 있습니다.

`.github` 폴더는 코드 실행용이 아니라 GitHub 협업 자동화 및 검증 설정을 위한 폴더입니다.

포함된 설정:

- `.github/pull_request_template.md`
  - PR 생성 시 자동으로 표시되는 템플릿입니다.
  - 작업 내용, 실행 방법, 체크리스트 등을 팀원이 동일한 형식으로 작성할 수 있도록 합니다.

- `.github/workflows/ci.yml`
  - GitHub Actions 기반 CI 설정입니다.
  - PR 생성 또는 `main` 브랜치 push 시 자동으로 검사를 실행합니다.

자동 실행 항목:

```text
Check
- npm run lint
- npm run typecheck
- npm run test
```

현재 `npm run lint`는 아래 검사를 함께 실행합니다.

```text
- Mobile ESLint
- Backend Checkstyle
```

전체 검증:

```bash
npm run check
```

CI 설정 파일 위치:

```text
.github/workflows/ci.yml
```

현재 루트 통합 스크립트를 사용하므로 모바일과 백엔드 검증을 하나의 명령으로 실행할 수 있습니다.

이를 통해:

- 스타일 규칙 위반
- 타입 오류
- 테스트 실패
- 플랫폼별 실행 차이
등을 PR 단계에서 자동으로 검증할 수 있습니다.
또한 PR 전에 로컬에서 npm run check를 통해 에러 확인 후 PR을 추천합니다.
---

# 8. 모바일 앱 실행

## 의존성 설치

```bash
cd mobile
npm install
```

## 기본 실행

```bash
npx expo start
```

터미널에 표시되는 QR 코드를 `Expo Go` 앱으로 스캔합니다.

연결이 원활하지 않으면 터널 모드를 사용합니다.

```bash
npx expo start --tunnel
```

---

## iOS 시뮬레이터 (macOS 전용)

Xcode가 설치되어 있어야 합니다.

```bash
npm run ios
```

> Windows에서는 iOS 시뮬레이터를 사용할 수 없습니다.
> 대신 iPhone 실기기 + Expo Go 조합으로 테스트합니다.

---

## Android 에뮬레이터

Android Studio 및 Android SDK가 설치되어 있어야 합니다.

```bash
npm run android
```

---

## 실기기 테스트

### iPhone

- Expo Go 설치
- QR 코드 스캔

### Android

- Expo Go 설치
- QR 코드 스캔

---

# 9. EditorConfig

프로젝트에는 `.editorconfig`가 포함되어 있습니다.

VS Code 또는 IntelliJ에서 EditorConfig 지원을 활성화하는 것을 권장합니다.

기본 규칙:

- UTF-8 인코딩 사용
- LF 줄바꿈 사용
- 기본 들여쓰기 2칸
- Java는 4칸 들여쓰기 사용

---

# 10. DB 및 API 네이밍 규칙

- Java 및 TypeScript 변수는 `camelCase` 사용
- API 요청/응답 JSON 필드는 `camelCase` 사용
- DB 테이블 및 컬럼명은 `snake_case` 사용
- 거리 값은 km 단위 사용
- 소수점 둘째 자리까지 저장

예시:

```ts
const recommendedPace = 6.3;
const totalDistance = 5.25;
```

```sql
CREATE TABLE running_log (
  running_log_id BIGINT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  course_id BIGINT,
  average_pace DECIMAL(5, 2),
  total_distance DECIMAL(6, 2),
  started_at DATETIME NOT NULL
);
```

Spring Boot에서는 Java 필드와 DB 컬럼을 아래처럼 매핑합니다.

```java
@Column(name = "recommended_pace")
private Double recommendedPace;
```

---

# 11. 환경 변수 규칙

공용 개발 서버 사용 시 `mobile/.env` 파일에 API 주소를 설정합니다.

```env
EXPO_PUBLIC_API_BASE_URL=http://EC2_PUBLIC_IP:8080
```

예시:

```env
EXPO_PUBLIC_API_BASE_URL=http://13.124.123.45:8080
```

주의 사항:

- `.env` 파일은 Git에 업로드하지 않습니다.
- `.env.example` 파일을 별도로 관리하는 것을 권장합니다.

---

# 12. EC2 및 Docker 예정 방향

초기 개발은 각자 로컬 환경에서 진행합니다.

추후 공용 개발 서버를 아래 구조로 구성할 예정입니다.

```text
EC2
 └─ Docker Compose
     ├─ Spring Boot Backend
     └─ MySQL Database
```

운영 방향:

- EC2는 공용 개발 서버로 사용합니다.
- Docker Compose로 팀원 간 실행 환경을 통일합니다.
- DB 비밀번호 및 `.env` 파일은 Git에 업로드하지 않습니다.
- 모바일 앱의 API 주소는 `localhost` 대신 EC2 주소 또는 도메인을 사용합니다.

---

# 13. 자주 헷갈리는 점

- Windows에서는 `npm run ios`를 사용할 수 없습니다.
- iPhone 실기기 + Expo Go로 iOS 테스트는 가능합니다.
- Android는 Windows에서도 실기기 및 에뮬레이터 테스트가 가능합니다.
- QR 코드 연결이 안 되면 `npx expo start --tunnel`을 먼저 시도합니다.
- 모바일 앱의 API 주소는 `localhost` 대신 EC2 주소 또는 같은 와이파이의 로컬 IP를 사용해야 합니다.
