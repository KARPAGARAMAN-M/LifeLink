package com.lifelink.controller;

import com.lifelink.dto.response.*;
import com.lifelink.service.AdminService;
import com.lifelink.service.BloodRequestService;
import com.lifelink.service.DonorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Admin controller for dashboard stats, user management, and system oversight.
 * All endpoints restricted to ADMIN role.
 */
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;
    private final DonorService donorService;
    private final BloodRequestService bloodRequestService;

    /**
     * Get dashboard analytics and statistics.
     */
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<DashboardStats>> getDashboardStats() {
        DashboardStats stats = adminService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success("Dashboard stats retrieved", stats));
    }

    /**
     * Get all users.
     */
    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        List<UserResponse> users = adminService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success("Users retrieved", users));
    }

    /**
     * Get all donors.
     */
    @GetMapping("/donors")
    public ResponseEntity<ApiResponse<List<DonorResponse>>> getAllDonors() {
        List<DonorResponse> donors = donorService.getAllDonors();
        return ResponseEntity.ok(ApiResponse.success("Donors retrieved", donors));
    }

    /**
     * Get all blood requests.
     */
    @GetMapping("/requests")
    public ResponseEntity<ApiResponse<List<BloodRequestResponse>>> getAllRequests() {
        List<BloodRequestResponse> requests = bloodRequestService.getAllRequests();
        return ResponseEntity.ok(ApiResponse.success("Requests retrieved", requests));
    }

    /**
     * Block a user.
     */
    @PutMapping("/users/{id}/block")
    public ResponseEntity<ApiResponse<UserResponse>> blockUser(@PathVariable Long id) {
        UserResponse user = adminService.blockUser(id);
        return ResponseEntity.ok(ApiResponse.success("User blocked successfully", user));
    }

    /**
     * Unblock a user.
     */
    @PutMapping("/users/{id}/unblock")
    public ResponseEntity<ApiResponse<UserResponse>> unblockUser(@PathVariable Long id) {
        UserResponse user = adminService.unblockUser(id);
        return ResponseEntity.ok(ApiResponse.success("User unblocked successfully", user));
    }
}
