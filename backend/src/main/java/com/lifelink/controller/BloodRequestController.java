package com.lifelink.controller;

import com.lifelink.dto.request.BloodRequestCreateDto;
import com.lifelink.dto.request.EmergencyRequestDto;
import com.lifelink.dto.response.ApiResponse;
import com.lifelink.dto.response.BloodRequestResponse;
import com.lifelink.entity.User;
import com.lifelink.service.BloodRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for blood request lifecycle management.
 */
@RestController
@RequestMapping("/api/requests")
@RequiredArgsConstructor
public class BloodRequestController {

    private final BloodRequestService bloodRequestService;

    /**
     * Create a new blood request (authenticated).
     */
    @PostMapping
    public ResponseEntity<ApiResponse<BloodRequestResponse>> createRequest(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody BloodRequestCreateDto dto) {
        BloodRequestResponse response = bloodRequestService.createRequest(user.getId(), dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Blood request created successfully", response));
    }

    /**
     * Create an emergency blood request without login (guest seeker).
     */
    @PostMapping("/emergency")
    public ResponseEntity<ApiResponse<BloodRequestResponse>> createEmergencyRequest(
            @Valid @RequestBody EmergencyRequestDto dto) {
        BloodRequestResponse response = bloodRequestService.createEmergencyGuestRequest(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Emergency blood request dispatched successfully", response));
    }

    /**
     * Accept a blood request (donor action).
     */
    @PutMapping("/{id}/accept")
    public ResponseEntity<ApiResponse<BloodRequestResponse>> acceptRequest(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        BloodRequestResponse response = bloodRequestService.acceptRequest(id, user.getId());
        return ResponseEntity.ok(ApiResponse.success("Blood request accepted", response));
    }

    /**
     * Reject a blood request (donor action).
     */
    @PutMapping("/{id}/reject")
    public ResponseEntity<ApiResponse<BloodRequestResponse>> rejectRequest(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        BloodRequestResponse response = bloodRequestService.rejectRequest(id, user.getId());
        return ResponseEntity.ok(ApiResponse.success("Blood request rejected", response));
    }

    /**
     * Mark a blood request as completed.
     */
    @PutMapping("/{id}/complete")
    public ResponseEntity<ApiResponse<BloodRequestResponse>> completeRequest(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        BloodRequestResponse response = bloodRequestService.completeRequest(id, user.getId());
        return ResponseEntity.ok(ApiResponse.success("Blood request completed", response));
    }

    /**
     * Get requests sent by the authenticated user.
     */
    @GetMapping("/my-requests")
    public ResponseEntity<ApiResponse<List<BloodRequestResponse>>> getMyRequests(
            @AuthenticationPrincipal User user) {
        List<BloodRequestResponse> requests = bloodRequestService.getMyRequests(user.getId());
        return ResponseEntity.ok(ApiResponse.success("Requests retrieved", requests));
    }

    /**
     * Get requests received by the authenticated user (as a donor).
     */
    @GetMapping("/donor-requests")
    public ResponseEntity<ApiResponse<List<BloodRequestResponse>>> getDonorRequests(
            @AuthenticationPrincipal User user) {
        List<BloodRequestResponse> requests = bloodRequestService.getDonorRequests(user.getId());
        return ResponseEntity.ok(ApiResponse.success("Donor requests retrieved", requests));
    }
}
