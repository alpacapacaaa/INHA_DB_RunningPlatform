package com.shaperun.domain.user.dto;

import com.shaperun.domain.user.enums.UserGender;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import lombok.Getter;
import lombok.NoArgsConstructor;

public class UserRequestDto {

    @Getter
    @NoArgsConstructor
    public static class SignupRequest {

        @NotBlank
        private String userId;

        @NotBlank
        private String password;

        @NotBlank
        @Email
        private String email;

        @NotBlank
        private String userName;

        @NotNull
        private LocalDate birthDate;

        @NotNull
        private UserGender gender;
    }

    @Getter
    @NoArgsConstructor
    public static class SigninRequest {

        @NotBlank
        private String userId;

        @NotBlank
        private String password;
    }

    @Getter
    @NoArgsConstructor
    public static class UpdateProfileRequest {

        private String userName;
        private UserGender gender;
    }
}
