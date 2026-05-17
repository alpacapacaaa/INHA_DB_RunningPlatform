package com.shaperun.domain.user.converter;

import com.shaperun.domain.user.dto.UserRequestDto;
import com.shaperun.domain.user.dto.UserResponseDto;
import com.shaperun.domain.user.entity.User;
import java.util.List;

public class UserConverter {

    public static User toUser(UserRequestDto.SignupRequest req, String encodedPassword) {
        return User.builder()
                .userId(req.getUserId())
                .userName(req.getUserName())
                .password(encodedPassword)
                .birthDate(req.getBirthDate())
                .gender(req.getGender())
                .email(req.getEmail())
                .build();
    }

    public static UserResponseDto.SigninResponse toSigninResponse(User user, String token) {
        return UserResponseDto.SigninResponse.builder()
                .token(token)
                .userId(user.getUserId())
                .build();
    }

    public static UserResponseDto.ProfileResponse toProfileResponse(
            User user, List<UserResponseDto.RecentRunRecord> recentRecords) {
        return UserResponseDto.ProfileResponse.builder()
                .userName(user.getUserName())
                .userLevel(mapLevel(user.getLevel()))
                .recentlyRecords(recentRecords)
                .build();
    }

    private static String mapLevel(int level) {
        return switch (level) {
            case 2 -> "INTERMEDIATE";
            case 3 -> "ADVANCED";
            case 4 -> "ELITE";
            default -> "BEGINNER";
        };
    }
}
