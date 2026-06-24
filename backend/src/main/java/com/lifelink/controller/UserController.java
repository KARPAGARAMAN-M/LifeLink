package com.lifelink.controller;

import com.lifelink.dto.request.UpdateProfileRequest;
import com.lifelink.dto.response.ApiResponse;
import com.lifelink.dto.response.UserResponse;
import com.lifelink.entity.User;
import com.lifelink.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * Controller for user profile operations.
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * Get the authenticated user's profile.
     */
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponse>> getProfile(
            @AuthenticationPrincipal User user) {
        UserResponse response = userService.getProfile(user.getId());
        return ResponseEntity.ok(ApiResponse.success("Profile retrieved", response));
    }

    /**
     * Update the authenticated user's profile.
     */
    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody UpdateProfileRequest request) {
        UserResponse response = userService.updateProfile(user.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated", response));
    }
}
