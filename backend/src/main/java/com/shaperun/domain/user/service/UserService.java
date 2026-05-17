package com.shaperun.domain.user.service;

import com.shaperun.domain.user.converter.UserConverter;
import com.shaperun.domain.user.dto.UserRequestDto;
import com.shaperun.domain.user.dto.UserResponseDto;
import com.shaperun.domain.user.entity.User;
import com.shaperun.domain.user.repository.UserRepository;
import com.shaperun.global.exception.CustomException;
import com.shaperun.global.exception.ErrorCode;
import com.shaperun.global.jwt.JwtTokenProvider;
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

    @Transactional
    public void signup(UserRequestDto.SignupRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new CustomException(ErrorCode.EMAIL_DUPLICATE);
        }
        userRepository.save(UserConverter.toUser(req, passwordEncoder.encode(req.getPassword())));
    }

    @Transactional
    public UserResponseDto.SigninResponse signin(UserRequestDto.SigninRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new CustomException(ErrorCode.INVALID_PASSWORD);
        }
        return UserConverter.toSigninResponse(user, jwtTokenProvider.generateToken(user.getEmail()));
    }

    @Transactional
    public void signout(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        user.logout();
    }

    public UserResponseDto.ProfileResponse getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        return UserConverter.toProfileResponse(user);
    }

    @Transactional
    public void updateProfile(String email, UserRequestDto.UpdateProfileRequest req) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        if (req.getEmail() != null && !req.getEmail().equals(email)) {
            if (userRepository.existsByEmail(req.getEmail())) {
                throw new CustomException(ErrorCode.EMAIL_DUPLICATE);
            }
        }
        String encodedPassword = req.getPassword() != null
                ? passwordEncoder.encode(req.getPassword()) : null;
        user.updateProfile(req.getUserName(), req.getEmail(), encodedPassword);
    }

    @Transactional
    public void updateLevel(String email, UserRequestDto.UpdateLevelRequest req) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        user.updateLevel(req.getLevel());
    }

    @Transactional
    public void deleteAccount(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        userRepository.delete(user);
    }
}
