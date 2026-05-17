package com.shaperun.domain.user.controller;

import com.shaperun.domain.user.dto.UserRequestDto;
import com.shaperun.domain.user.dto.UserResponseDto;
import com.shaperun.domain.user.service.UserService;
import com.shaperun.global.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<Void>> signup(@RequestBody @Valid UserRequestDto.SignupRequest req) {
        userService.signup(req);
        return ResponseEntity.ok(ApiResponse.success("회원가입이 완료되었습니다."));
    }

    @PostMapping("/signin")
    public ResponseEntity<ApiResponse<UserResponseDto.SigninResponse>> signin(
            @RequestBody @Valid UserRequestDto.SigninRequest req) {
        return ResponseEntity.ok(ApiResponse.success("로그인이 완료되었습니다.", userService.signin(req)));
    }

    @PostMapping("/signout")
    public ResponseEntity<ApiResponse<Void>> signout() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        userService.signout(email);
        return ResponseEntity.ok(ApiResponse.success("로그아웃이 완료되었습니다."));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponseDto.ProfileResponse>> getProfile() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(ApiResponse.success("프로필 조회가 완료되었습니다.", userService.getProfile(email)));
    }

    @PatchMapping("/me")
    public ResponseEntity<ApiResponse<Void>> updateProfile(@RequestBody UserRequestDto.UpdateProfileRequest req) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        userService.updateProfile(email, req);
        return ResponseEntity.ok(ApiResponse.success("프로필이 수정되었습니다."));
    }

    @PatchMapping("/me/level")
    public ResponseEntity<ApiResponse<Void>> updateLevel(@RequestBody @Valid UserRequestDto.UpdateLevelRequest req) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        userService.updateLevel(email, req);
        return ResponseEntity.ok(ApiResponse.success("레벨이 업데이트되었습니다."));
    }

    @DeleteMapping("/me")
    public ResponseEntity<ApiResponse<Void>> deleteAccount() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        userService.deleteAccount(email);
        return ResponseEntity.ok(ApiResponse.success("회원탈퇴가 완료되었습니다."));
    }
}
