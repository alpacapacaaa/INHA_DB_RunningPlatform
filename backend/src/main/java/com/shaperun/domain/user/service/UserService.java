package com.shaperun.domain.user.service;

import com.shaperun.domain.user.converter.UserConverter;
import com.shaperun.domain.user.dto.UserRequestDto;
import com.shaperun.domain.user.dto.UserResponseDto;
import com.shaperun.domain.user.entity.User;
import com.shaperun.domain.user.repository.UserRepository;
import com.shaperun.global.exception.CustomException;
import com.shaperun.global.exception.ErrorCode;
import com.shaperun.global.jwt.JwtTokenProvider;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    // 회원가입
    @Transactional
    public void signup(UserRequestDto.SignupRequest req) {
        if (userRepository.existsByUserId(req.getUserId())) {
            throw new CustomException(ErrorCode.USER_ID_DUPLICATE);
        }
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new CustomException(ErrorCode.EMAIL_DUPLICATE);
        }
        userRepository.save(UserConverter.toUser(req, passwordEncoder.encode(req.getPassword())));
    }

    // 로그인
    @Transactional
    public UserResponseDto.SigninResponse signin(UserRequestDto.SigninRequest req) {
        User user = userRepository.findById(req.getUserId())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new CustomException(ErrorCode.INVALID_PASSWORD);
        }
        return UserConverter.toSigninResponse(user, jwtTokenProvider.generateToken(user.getUserId()));
    }

    // 로그아웃
    @Transactional
    public void signout(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        user.logout();
    }

    // 마이페이지 조회
    public UserResponseDto.ProfileResponse getProfile(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        return UserConverter.toProfileResponse(user, List.of());
    }

    // 마이페이지 수정
    @Transactional
    public void updateProfile(String userId, UserRequestDto.UpdateProfileRequest req) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        user.updateProfile(req.getUserName(), req.getGender());
    }

    // 계정 삭제
    @Transactional
    public void deleteAccount(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        userRepository.delete(user);
    }
}
