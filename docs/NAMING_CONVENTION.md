# 네이밍 규칙

코드, API, DB에서 이름 짓는 방식이 섞이면 프론트와 백엔드 연결 과정에서 실수가 자주 생깁니다.

Shape Run에서는 아래 규칙을 기본으로 사용합니다.

## 코드 네이밍

Java, TypeScript, JavaScript 코드에서는 `camelCase`를 사용합니다.

```ts
const courseTitle = "여의도 고구마런";
const recommendedPace = 6.3;
```

```java
private String courseTitle;
private Double recommendedPace;
```

클래스명과 타입명은 `PascalCase`를 사용합니다.

```java
public class RunningLog {
}
```

```ts
type RunningLog = {
  courseTitle: string;
};
```

## DB 네이밍

DB 테이블명과 컬럼명은 `snake_case`를 사용합니다.

```sql
course
running_log
created_at
recommended_pace
```

예시:

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

## API JSON 네이밍

API 요청/응답 JSON은 프론트에서 바로 쓰기 쉽도록 `camelCase`를 기본으로 사용합니다.

```json
{
  "courseId": 1,
  "courseTitle": "여의도 고구마런",
  "recommendedPace": 6.3,
  "totalDistance": 5.25
}
```

## Entity와 DB 컬럼 매핑

Spring Boot에서는 Java 필드는 `camelCase`, DB 컬럼은 `snake_case`로 매핑합니다.

```java
@Column(name = "recommended_pace")
private Double recommendedPace;
```

JPA 네이밍 전략으로 자동 변환을 사용할 수도 있지만, 중요한 컬럼은 명시적으로 적어두는 것을 권장합니다.

## 거리 저장 규칙

거리 값은 km 단위로 저장하고 소수점 둘째 자리까지 사용합니다.

예시:

```text
5.25km
10.00km
```

DB에서는 `DECIMAL(6, 2)` 또는 프로젝트 규모에 맞는 `DECIMAL` 타입을 사용합니다.
