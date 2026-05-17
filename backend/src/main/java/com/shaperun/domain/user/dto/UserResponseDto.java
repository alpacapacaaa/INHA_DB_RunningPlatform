package com.shaperun.domain.user.dto;

import com.shaperun.domain.user.enums.RunLevel;
import lombok.Builder;
import lombok.Getter;

public class UserResponseDto {

    @Getter
    @Builder
    public static class SigninResponse {

        private Long userId;
        private String token;
    }

    @Getter
    @Builder
    public static class ProfileResponse {

        private String userName;
        private String email;
        private RunLevel level;
        private boolean levelTested;
    }
}
