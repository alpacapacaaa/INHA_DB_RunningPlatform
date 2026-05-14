package com.shaperun.global.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    // Common
    INVALID_INPUT(400, "잘못된 입력값입니다."),
    UNAUTHORIZED(401, "인증이 필요합니다."),
    FORBIDDEN(403, "접근 권한이 없습니다."),
    NOT_FOUND(404, "리소스를 찾을 수 없습니다."),
    INTERNAL_SERVER_ERROR(500, "서버 오류가 발생했습니다."),

    // User
    USER_NOT_FOUND(404, "사용자를 찾을 수 없습니다."),
    USER_ID_DUPLICATE(409, "이미 사용 중인 아이디입니다."),
    EMAIL_DUPLICATE(409, "이미 사용 중인 이메일입니다."),
    INVALID_PASSWORD(401, "비밀번호가 올바르지 않습니다."),

    // JWT
    INVALID_TOKEN(401, "유효하지 않은 토큰입니다."),
    EXPIRED_TOKEN(401, "만료된 토큰입니다."),

    // Crew
    CREW_NOT_FOUND(404, "크루를 찾을 수 없습니다."),
    CREW_NAME_DUPLICATE(409, "이미 사용 중인 크루 이름입니다."),
    CREW_PASSWORD_INCORRECT(401, "크루 비밀번호가 올바르지 않습니다."),
    ALREADY_IN_CREW(409, "이미 가입한 크루입니다."),
    NOT_CREW_MEMBER(404, "크루 멤버가 아닙니다."),
    NOT_CREW_LEADER(403, "크루장만 가능한 작업입니다."),
    CREW_LEADER_CANNOT_LEAVE(400, "크루장은 위임 후 탈퇴할 수 있습니다."),
    CANNOT_KICK_SELF(400, "자신은 추방할 수 없습니다.");

    private final int status;
    private final String message;
}
