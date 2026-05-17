package com.shaperun.domain.user.dto;

import com.shaperun.domain.user.enums.RunLevel;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

public class UserRequestDto {

    @Getter
    @NoArgsConstructor
    public static class SignupRequest {

        @NotBlank
        @Email
        private String email;

        @NotBlank
        private String password;

        @NotBlank
        private String userName;
    }

    @Getter
    @NoArgsConstructor
    public static class SigninRequest {

        @NotBlank
        @Email
        private String email;

        @NotBlank
        private String password;
    }

    @Getter
    @NoArgsConstructor
    public static class UpdateProfileRequest {

        private String userName;
        private String email;
        private String password;
    }

    @Getter
    @NoArgsConstructor
    public static class UpdateLevelRequest {

        @NotNull
        private RunLevel level;
    }
}
