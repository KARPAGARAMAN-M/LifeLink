package com.lifelink.service;

import com.lifelink.dto.response.DashboardStats;
import com.lifelink.dto.response.UserResponse;
import com.lifelink.entity.User;
import com.lifelink.enums.RequestStatus;
import com.lifelink.exception.ResourceNotFoundException;
import com.lifelink.repository.BloodRequestRepository;
import com.lifelink.repository.DonorRepository;
import com.lifelink.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Service for admin-specific operations: dashboard stats, user management.
 */
@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final DonorRepository donorRepository;
    private final BloodRequestRepository bloodRequestRepository;

    /**
     * Get comprehensive dashboard statistics.
     */
    public DashboardStats getDashboardStats() {
        // Blood group distribution from donors
        Map<String, Long> bloodGroupDistribution = new HashMap<>();
        donorRepository.getBloodGroupDistribution().forEach(row -> {
            String bloodGroup = row[0].toString();
            Long count = (Long) row[1];
            // Convert enum name to display name
            try {
                bloodGroupDistribution.put(
                        com.lifelink.enums.BloodGroup.valueOf(bloodGroup).getDisplayName(),
                        count
                );
            } catch (IllegalArgumentException e) {
                bloodGroupDistribution.put(bloodGroup, count);
            }
        });

        return DashboardStats.builder()
                .totalUsers(userRepository.count())
                .totalDonors(donorRepository.count())
                .activeDonors(donorRepository.countByAvailabilityTrue())
                .totalRequests(bloodRequestRepository.count())
                .pendingRequests(bloodRequestRepository.countByStatus(RequestStatus.PENDING))
                .completedRequests(bloodRequestRepository.countByStatus(RequestStatus.COMPLETED))
                .acceptedRequests(bloodRequestRepository.countByStatus(RequestStatus.ACCEPTED))
                .rejectedRequests(bloodRequestRepository.countByStatus(RequestStatus.REJECTED))
                .bloodGroupDistribution(bloodGroupDistribution)
                .build();
    }

    /**
     * Get all users for admin management.
     */
    public List<UserResponse> getAllUsers() {
        return userRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());
    }

    /**
     * Block a user by ID.
     */
    @Transactional
    public UserResponse blockUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        user.setIsBlocked(true);
        User saved = userRepository.save(user);
        return mapToUserResponse(saved);
    }

    /**
     * Unblock a user by ID.
     */
    @Transactional
    public UserResponse unblockUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        user.setIsBlocked(false);
        User saved = userRepository.save(user);
        return mapToUserResponse(saved);
    }

    private UserResponse mapToUserResponse(User user) {
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
