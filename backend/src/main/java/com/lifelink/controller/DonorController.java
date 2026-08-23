package com.lifelink.controller;

import com.lifelink.dto.request.DonorRegistrationRequest;
import com.lifelink.dto.response.ApiResponse;
import com.lifelink.dto.response.DonorResponse;
import com.lifelink.entity.User;
import com.lifelink.service.DonorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for donor-related operations: registration, update, search.
 */
@RestController
@RequestMapping("/api/donors")
@RequiredArgsConstructor
public class DonorController {

    private final DonorService donorService;

    /**
     * Register the authenticated user as a blood donor.
     */
    @PostMapping
    public ResponseEntity<ApiResponse<DonorResponse>> registerDonor(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody DonorRegistrationRequest request) {
        DonorResponse response = donorService.registerDonor(user.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Donor registration successful", response));
    }

    /**
     * Update the authenticated user's donor profile.
     */
    @PutMapping
    public ResponseEntity<ApiResponse<DonorResponse>> updateDonor(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody DonorRegistrationRequest request) {
        DonorResponse response = donorService.updateDonor(user.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Donor profile updated", response));
    }

    /**
     * Search donors by blood group, city, state, latitude, longitude, radius (public endpoint).
     */
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<DonorResponse>>> searchDonors(
            @RequestParam(required = false) String bloodGroup,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) Double latitude,
            @RequestParam(required = false) Double longitude,
            @RequestParam(required = false) Double radius) {
        List<DonorResponse> donors = donorService.searchDonors(bloodGroup, city, state, latitude, longitude, radius);
        return ResponseEntity.ok(ApiResponse.success("Donors found", donors));
    }

    /**
     * Get a specific donor by ID (public endpoint).
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DonorResponse>> getDonorById(@PathVariable Long id) {
        DonorResponse response = donorService.getDonorById(id);
        return ResponseEntity.ok(ApiResponse.success("Donor found", response));
    }

    /**
     * Get the authenticated user's donor profile.
     */
    @GetMapping("/my-profile")
    public ResponseEntity<ApiResponse<DonorResponse>> getMyDonorProfile(
            @AuthenticationPrincipal User user) {
        DonorResponse response = donorService.getDonorByUserId(user.getId());
        return ResponseEntity.ok(ApiResponse.success("Donor profile found", response));
    }

    /**
     * Toggle availability status.
     */
    @PatchMapping("/availability")
    public ResponseEntity<ApiResponse<DonorResponse>> toggleAvailability(
            @AuthenticationPrincipal User user) {
        DonorResponse response = donorService.toggleAvailability(user.getId());
        return ResponseEntity.ok(ApiResponse.success("Availability updated", response));
    }

    /**
     * Check if the authenticated user is registered as a donor.
     */
    @GetMapping("/check")
    public ResponseEntity<ApiResponse<Boolean>> checkDonorStatus(
            @AuthenticationPrincipal User user) {
        boolean isDonor = donorService.isDonor(user.getId());
        return ResponseEntity.ok(ApiResponse.success("Donor status checked", isDonor));
    }
}
