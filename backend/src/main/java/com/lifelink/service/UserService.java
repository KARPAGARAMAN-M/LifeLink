package com.lifelink.service;

import com.lifelink.dto.request.UpdateProfileRequest;
import com.lifelink.dto.response.UserResponse;
import com.lifelink.entity.User;
import com.lifelink.exception.ResourceNotFoundException;
import com.lifelink.exception.UnauthorizedException;
import com.lifelink.repository.DonorRepository;
import com.lifelink.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for user profile operations.
 */
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final DonorRepository donorRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Get user profile by user ID.
     */
    public UserResponse getProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        return mapToResponse(user);
    }

    /**
     * Update user profile (name and/or password).
     */
    @Transactional
    public UserResponse updateProfile(Long userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        if (request.getName() != null && !request.getName().isEmpty()) {
            user.setName(request.getName());
        }

        if (request.getNewPassword() != null && !request.getNewPassword().isEmpty()) {
            if (request.getCurrentPassword() == null ||
                    !passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                throw new UnauthorizedException("Current password is incorrect");
            }
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        }

        User saved = userRepository.save(user);
        return mapToResponse(saved);
    }

    private UserResponse mapToResponse(User user) {
        boolean isDonor = donorRepository.existsByUserId(user.getId());
        String bloodGroup = null;
        if (isDonor) {
            bloodGroup = donorRepository.findByUserId(user.getId())
                    .map(d -> d.getBloodGroup().getDisplayName())
                    .orElse(null);
        }

        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .isBlocked(user.getIsBlocked())
                .isDonor(isDonor)
                .bloodGroup(bloodGroup)
                .createdAt(user.getCreatedAt())
                .build();
    }
}
