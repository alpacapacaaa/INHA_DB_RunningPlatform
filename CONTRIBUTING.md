# Shape Run 협업 가이드

이 문서는 Shape Run 팀원이 같은 기준으로 개발하기 위한 협업 규칙과 로컬 적용 방법을 정리합니다.

## 1. 기본 작업 흐름

1. `main` 브랜치는 항상 실행 가능한 상태로 유지합니다.
2. 개인 작업은 원본 저장소를 직접 수정하지 않고 fork 저장소에서 진행합니다.
3. 기능 작업은 fork 저장소의 새 브랜치에서 진행합니다.
4. 작업 완료 후 원본 저장소의 `main` 브랜치로 PR을 생성합니다.
5. PR에는 상대 팀원 2명을 리뷰어로 지정합니다.
6. 본인이 올린 PR을 직접 머지하지 않습니다.
7. PR 머지 전에는 충돌 해결, 타입 체크, 린트 확인을 완료합니다.

## 2. Fork 적용 방법

GitHub에서 원본 저장소를 fork한 뒤, 내 fork 저장소를 clone합니다.

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

작업 브랜치를 만들고 작업합니다.

```bash
git switch -c feature/course-detail
```

작업 후 내 fork 저장소로 push하고 GitHub에서 PR을 생성합니다.

```bash
git push origin feature/course-detail
```

## 3. 브랜치 규칙

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

## 4. 커밋 컨벤션

커밋 메시지는 아래 형식을 사용합니다.

```text
type: 변경 내용 요약
```

사용 타입:

- `feat`: 새로운 기능 추가
- `fix`: 버그 수정
- `docs`: 문서 수정
- `style`: 포맷팅 등 동작과 무관한 수정
- `refactor`: 기능 변화 없는 구조 개선
- `test`: 테스트 추가 또는 수정
- `chore`: 설정, 패키지, 빌드 관련 수정
- `remove`: 파일 또는 코드 삭제
- `rename`: 파일명 또는 폴더명 변경

예시:

```text
feat: 코스 상세 화면 추가
fix: GPS 거리 계산 오류 수정
docs: Expo 실행 방법 정리
chore: 모바일 lint 설정 추가
remove: 사용하지 않는 frontend 삭제
```

한 커밋에는 하나의 목적만 담습니다.

## 5. PR 규칙

PR 제목도 커밋 컨벤션과 같은 형식을 사용합니다.

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

머지 전 규칙:

- 상대 팀원 2명을 리뷰어로 지정합니다.
- 리뷰어 확인이 끝나기 전에는 머지하지 않습니다.
- 본인이 올린 PR은 본인이 직접 머지하지 않습니다.
- 내 작업과 관련 없는 파일이 섞이지 않았는지 확인합니다.
- 모바일 변경 시 `npm run lint`, `npm run typecheck`를 실행합니다.
- 백엔드 변경 시 `./gradlew test` 또는 `gradlew.bat test`를 실행합니다.

## 6. 로컬 개발 환경 설정

공통 준비:

- Git
- Node.js 20 LTS
- Java 21
- Android Studio
- Expo Go 앱

모바일 앱 실행:

```bash
cd mobile
npm install
npx expo start
```

iOS 시뮬레이터는 macOS에서만 실행할 수 있습니다.

```bash
cd mobile
npm run ios
```

Windows에서는 iPhone 또는 Android 실기기에 Expo Go를 설치하고 QR 코드를 스캔합니다.

백엔드 실행:

```bash
cd backend
./gradlew bootRun
```

Windows:

```bash
cd backend
gradlew.bat bootRun
```

## 7. 로컬 확인 명령어

```bash
cd mobile
npm run lint
npm run typecheck
```

```bash
cd backend
./gradlew test
```

Windows에서는 `backend/gradlew.bat test`를 사용합니다.

`.editorconfig`가 포함되어 있으므로 VS Code 또는 IntelliJ에서 EditorConfig 지원을 켜는 것을 권장합니다.

## 8. DB 및 API 네이밍 규칙

- Java, TypeScript 변수와 객체 필드는 `camelCase`를 사용합니다.
- API 요청/응답 JSON 필드는 `camelCase`를 사용합니다.
- DB 테이블명과 컬럼명은 `snake_case`를 사용합니다.
- 거리 값은 km 단위로 저장하고 소수점 둘째 자리까지 사용합니다.

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

Spring Boot에서는 Java 필드는 `camelCase`, DB 컬럼은 `snake_case`로 매핑합니다.

```java
@Column(name = "recommended_pace")
private Double recommendedPace;
```

## 9. EC2 및 Docker 예정 방향

초기 개발은 각자 로컬에서 진행합니다.

백엔드 API가 안정되면 EC2에 공용 개발 서버를 두고, Docker Compose로 백엔드와 DB 실행 환경을 맞출 예정입니다.

예정 구조:

```text
EC2 서버
  └─ Docker Compose
       ├─ Spring Boot Backend
       └─ MySQL Database
```

권장 방향:

- EC2는 공용 개발 서버 역할로 사용합니다.
- Docker는 팀원 간 실행 환경을 맞추기 위해 사용합니다.
- DB 비밀번호와 `.env` 파일은 Git에 올리지 않습니다.
- 모바일 앱의 API 주소는 `localhost`가 아니라 EC2 퍼블릭 IP 또는 도메인을 사용합니다.
