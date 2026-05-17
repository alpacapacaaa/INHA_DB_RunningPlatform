package com.shaperun.global.response;

import lombok.Getter;

@Getter
public class ApiResponse<T> {

    private final int status;
    private final String message;
    private final T data;

    private ApiResponse(int status, String message, T data) {
        this.status = status;
        this.message = message;
        this.data = data;
    }

    // 일반적인 성공 케이스
    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(200, message, data);
    }

    // 로그아웃, 회원탈퇴 시 성공 케이스
    public static <T> ApiResponse<T> success(String message) {
        return new ApiResponse<>(200, message, null);
    }

    // 실패 케이스
    public static <T> ApiResponse<T> error(int status, String message) {
        return new ApiResponse<>(status, message, null);
    }
}
