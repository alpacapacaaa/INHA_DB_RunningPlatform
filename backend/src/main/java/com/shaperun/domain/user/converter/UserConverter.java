package com.shaperun.domain.user.converter;

import com.shaperun.domain.user.dto.UserRequestDto;
import com.shaperun.domain.user.dto.UserResponseDto;
import com.shaperun.domain.user.entity.User;

public class UserConverter {

    public static User toUser(UserRequestDto.SignupRequest req, String encodedPassword) {
        return User.builder()
                .userName(req.getUserName())
                .email(req.getEmail())
                .password(encodedPassword)
                .build();
    }

    public static UserResponseDto.SigninResponse toSigninResponse(User user, String token) {
        return UserResponseDto.SigninResponse.builder()
                .userId(user.getUserId())
                .token(token)
                .build();
    }

    public static UserResponseDto.ProfileResponse toProfileResponse(User user) {
        return UserResponseDto.ProfileResponse.builder()
                .userName(user.getUserName())
                .email(user.getEmail())
                .level(user.getLevel())
                .levelTested(user.isLevelTested())
                .build();
    }
}
