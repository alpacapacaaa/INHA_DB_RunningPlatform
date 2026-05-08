# EC2/Docker 배포 준비

초기 개발은 로컬에서 진행하지만, 백엔드 API 연동이 시작되면 EC2에 공용 개발 서버를 둘 예정입니다.

## 왜 EC2와 Docker를 같이 쓰는가

EC2는 팀이 함께 접속할 수 있는 공용 서버 역할을 합니다.

Docker는 백엔드와 DB 실행 환경을 팀원마다 동일하게 맞추는 역할을 합니다.

즉, 둘 중 하나를 고르는 것이 아니라 아래처럼 함께 사용합니다.

```text
EC2 서버
  └─ Docker Compose
       ├─ Spring Boot Backend
       └─ MySQL Database
```

## 예정 서버 구조

- AWS EC2: 공용 개발 서버
- Ubuntu 22.04 LTS 또는 24.04 LTS
- Docker
- Docker Compose
- Spring Boot 백엔드
- MySQL DB

## EC2 인스턴스 권장 설정

- AMI: Ubuntu Server 22.04 LTS 또는 24.04 LTS
- 인스턴스 유형: `t3.micro` 또는 프리티어라면 `t2.micro`
- 스토리지: 20GB 이상
- 키 페어: `.pem` 파일로 생성 후 안전하게 보관
- 보안 그룹:
  - SSH `22`: 내 IP만 허용
  - Backend `8080`: 팀 테스트용으로 허용
  - HTTP `80`: 추후 도메인/프록시 연결 시 사용
  - HTTPS `443`: 추후 SSL 적용 시 사용

## Docker Compose 예정 예시

추후 백엔드 구현이 안정되면 루트 또는 `infra/` 폴더에 `docker-compose.yml`을 둘 수 있습니다.

```yaml
services:
  db:
    image: mysql:8.4
    environment:
      MYSQL_DATABASE: shaperun
      MYSQL_USER: shaperun
      MYSQL_PASSWORD: shaperun_password
      MYSQL_ROOT_PASSWORD: root_password
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

  backend:
    build: ./backend
    depends_on:
      - db
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://db:3306/shaperun
      SPRING_DATASOURCE_USERNAME: shaperun
      SPRING_DATASOURCE_PASSWORD: shaperun_password
    ports:
      - "8080:8080"

volumes:
  mysql_data:
```

이 파일은 아직 바로 적용하는 최종 설정이 아니라, 앞으로의 방향을 보여주는 예시입니다.

## 모바일 앱 API 주소

EC2에 백엔드가 올라가면 모바일 앱의 `.env`에 EC2 주소를 넣습니다.

```env
EXPO_PUBLIC_API_BASE_URL=http://EC2_PUBLIC_IP:8080
```

실기기에서 테스트할 때는 `localhost`가 아니라 EC2 퍼블릭 IP 또는 도메인을 사용해야 합니다.

## 운영 전 체크할 것

- DB 비밀번호를 Git에 올리지 않기
- `.env` 파일을 Git에 올리지 않기
- EC2 보안 그룹에서 SSH는 내 IP만 허용하기
- DB 포트 `3306`은 외부에 직접 열지 않기
- 백엔드 API 주소가 프론트 `.env`와 일치하는지 확인하기
- PR이 머지될 때 CI가 통과하는지 확인하기
