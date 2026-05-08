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
git clone https://github.com/alpacapacaaa/INHA_DB_RunningPlatform.git
cd INHA_DB_RunningPlatform
```

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
