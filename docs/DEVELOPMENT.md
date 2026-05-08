# 개발 환경 설정

Shape Run은 Expo 기반 모바일 앱과 Spring Boot 백엔드로 구성합니다.

## 공통 준비

- Git
- Node.js 20 LTS
- npm
- Java 21
- Android Studio
- iPhone 또는 Android 실기기
- Expo Go 앱

## 저장소 받기

```bash
git clone https://github.com/내깃허브아이디/INHA_DB_RunningPlatform.git
cd INHA_DB_RunningPlatform
git remote add upstream https://github.com/alpacapacaaa/INHA_DB_RunningPlatform.git
```

팀 작업은 원본 저장소를 직접 clone해서 push하지 않고, 각자 fork한 저장소를 clone해서 진행합니다.

## 로컬 규칙 적용 방법

저장소를 받은 뒤 아래 순서로 로컬 환경을 맞춥니다.

```bash
cd mobile
npm install
npm run lint
npm run typecheck
```

백엔드도 확인합니다.

```bash
cd ../backend
./gradlew test
```

Windows에서는 아래 명령어를 사용합니다.

```bash
cd backend
gradlew.bat test
```

`.editorconfig`가 포함되어 있으므로 VS Code 또는 IntelliJ에서 EditorConfig 지원을 켜면 들여쓰기, 줄바꿈, 마지막 줄 개행 규칙이 자동 적용됩니다.

VS Code 권장 확장:

- EditorConfig for VS Code
- ESLint
- Prettier
- Expo Tools
- Extension Pack for Java

## 모바일 앱 실행

```bash
cd mobile
npm install
npx expo start
```

터미널에 표시되는 QR 코드를 휴대폰의 Expo Go 앱으로 스캔합니다.

같은 와이파이에서 연결이 되지 않으면 터널 모드로 실행합니다.

```bash
npx expo start --tunnel
```

## macOS에서 iOS 시뮬레이터 실행

Xcode가 설치되어 있어야 합니다.

```bash
cd mobile
npm run ios
```

## Windows에서 확인

Windows에서는 iOS 시뮬레이터를 실행할 수 없습니다.

대신 아래 방식으로 확인합니다.

- iPhone 실기기: `npx expo start` 후 Expo Go로 QR 스캔
- Android 실기기: `npx expo start` 후 Expo Go로 QR 스캔
- Android 에뮬레이터: Android Studio 실행 후 `npm run android`

## 백엔드 실행

```bash
cd backend
./gradlew bootRun
```

Windows:

```bash
cd backend
gradlew.bat bootRun
```

## API 주소 설정

모바일 앱에서 백엔드 API 주소는 `mobile/.env`에 작성합니다.

```env
EXPO_PUBLIC_API_BASE_URL=http://EC2_PUBLIC_IP:8080
```

실기기에서 테스트할 때는 `localhost`를 사용하면 안 됩니다.

- 공용 서버 사용: EC2 퍼블릭 IP 또는 도메인 사용
- 같은 와이파이 로컬 서버 사용: 백엔드 개발자 PC의 로컬 IP 사용

## 확인 명령어

모바일:

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

## 앞으로의 개발 서버 방향

초기에는 각자 로컬에서 모바일 앱과 백엔드를 실행합니다.

백엔드 API가 어느 정도 잡히면 EC2에 공용 개발 서버를 두고, 모바일 앱은 EC2 주소를 바라보도록 설정할 예정입니다.

예정 구조:

- EC2: 공용 개발 서버
- Docker: 백엔드와 DB 실행 환경 통일
- Docker Compose: Spring Boot 서버와 MySQL을 한 번에 실행
- GitHub Actions: PR마다 lint, typecheck, backend test 자동 실행

자세한 내용은 [EC2/Docker 배포 준비](./DEPLOYMENT.md)를 참고합니다.
