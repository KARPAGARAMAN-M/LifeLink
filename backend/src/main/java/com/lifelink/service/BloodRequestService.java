package com.lifelink.service;

import com.lifelink.dto.request.BloodRequestCreateDto;
import com.lifelink.dto.response.BloodRequestResponse;
import com.lifelink.entity.BloodRequest;
import com.lifelink.entity.Donor;
import com.lifelink.entity.User;
import com.lifelink.enums.BloodGroup;
import com.lifelink.enums.RequestStatus;
import com.lifelink.enums.Urgency;
import com.lifelink.exception.ResourceNotFoundException;
import com.lifelink.exception.UnauthorizedException;
import com.lifelink.repository.BloodRequestRepository;
import com.lifelink.repository.DonorRepository;
import com.lifelink.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service managing the lifecycle of blood donation requests.
 */
@Service
@RequiredArgsConstructor
public class BloodRequestService {

    private final BloodRequestRepository bloodRequestRepository;
    private final UserRepository userRepository;
    private final DonorRepository donorRepository;
    private final EmailService emailService;

    /**
     * Create a new blood request from the authenticated user to a specific donor.
     */
    @Transactional
    public BloodRequestResponse createRequest(Long requesterId, BloodRequestCreateDto dto) {
        User requester = userRepository.findById(requesterId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", requesterId));

        Donor donor = donorRepository.findById(dto.getDonorId())
                .orElseThrow(() -> new ResourceNotFoundException("Donor", "id", dto.getDonorId()));

        BloodGroup bloodGroup = BloodGroup.fromDisplayName(dto.getBloodGroup());
        Urgency urgency = dto.getUrgency() != null ?
                Urgency.valueOf(dto.getUrgency().toUpperCase()) : Urgency.NORMAL;

        BloodRequest bloodRequest = BloodRequest.builder()
                .requester(requester)
                .donor(donor)
                .bloodGroup(bloodGroup)
                .hospitalName(dto.getHospitalName())
                .city(dto.getCity())
                .urgency(urgency)
                .status(RequestStatus.PENDING)
                .message(dto.getMessage())
                .build();

        BloodRequest saved = bloodRequestRepository.save(bloodRequest);

        // Send email notification to donor
        try {
            emailService.sendBloodRequestNotification(
                    donor.getUser().getEmail(),
                    donor.getUser().getName(),
                    requester.getName(),
                    bloodGroup.getDisplayName(),
                    dto.getHospitalName(),
                    urgency.name()
            );
        } catch (Exception e) {
            // Don't fail the request if email fails
        }

        return mapToResponse(saved);
    }

    /**
     * Accept a blood request (only the targeted donor can accept).
     */
    @Transactional
    public BloodRequestResponse acceptRequest(Long requestId, Long userId) {
        BloodRequest request = getRequestAndValidateDonor(requestId, userId);

        if (request.getStatus() != RequestStatus.PENDING) {
            throw new IllegalArgumentException("Only pending requests can be accepted");
        }

        request.setStatus(RequestStatus.ACCEPTED);
        BloodRequest updated = bloodRequestRepository.save(request);

        // Notify requester
        try {
            emailService.sendRequestAcceptedNotification(
                    request.getRequester().getEmail(),
                    request.getRequester().getName(),
                    request.getDonor().getUser().getName(),
                    request.getDonor().getPhone()
            );
        } catch (Exception e) {
            // Don't fail if email fails
        }

        return mapToResponse(updated);
    }

    /**
     * Reject a blood request (only the targeted donor can reject).
     */
    @Transactional
    public BloodRequestResponse rejectRequest(Long requestId, Long userId) {
        BloodRequest request = getRequestAndValidateDonor(requestId, userId);

        if (request.getStatus() != RequestStatus.PENDING) {
            throw new IllegalArgumentException("Only pending requests can be rejected");
        }

        request.setStatus(RequestStatus.REJECTED);
        BloodRequest updated = bloodRequestRepository.save(request);
        return mapToResponse(updated);
    }

    /**
     * Mark a blood request as completed (donor or requester can complete).
     */
    @Transactional
    public BloodRequestResponse completeRequest(Long requestId, Long userId) {
        BloodRequest request = bloodRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Blood request", "id", requestId));

        boolean isDonor = request.getDonor().getUser().getId().equals(userId);
        boolean isRequester = request.getRequester().getId().equals(userId);

        if (!isDonor && !isRequester) {
            throw new UnauthorizedException("You are not authorized to complete this request");
        }

        if (request.getStatus() != RequestStatus.ACCEPTED) {
            throw new IllegalArgumentException("Only accepted requests can be marked as completed");
        }

        request.setStatus(RequestStatus.COMPLETED);
        BloodRequest updated = bloodRequestRepository.save(request);

        // Notify both parties
        try {
            emailService.sendRequestCompletedNotification(
                    request.getRequester().getEmail(),
                    request.getRequester().getName(),
                    request.getDonor().getUser().getName()
            );
        } catch (Exception e) {
            // Don't fail if email fails
        }

        return mapToResponse(updated);
    }

    /**
     * Get requests sent by the authenticated user.
     */
    public List<BloodRequestResponse> getMyRequests(Long userId) {
        return bloodRequestRepository.findByRequesterIdOrderByCreatedAtDesc(userId)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    /**
     * Get requests received by the authenticated user (as donor).
     */
    public List<BloodRequestResponse> getDonorRequests(Long userId) {
        return bloodRequestRepository.findByDonorUserIdOrderByCreatedAtDesc(userId)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    /**
     * Get all requests (admin).
     */
    public List<BloodRequestResponse> getAllRequests() {
        return bloodRequestRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    // --- Private Helpers ---

    private BloodRequest getRequestAndValidateDonor(Long requestId, Long userId) {
        BloodRequest request = bloodRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Blood request", "id", requestId));

        if (!request.getDonor().getUser().getId().equals(userId)) {
            throw new UnauthorizedException("Only the targeted donor can perform this action");
        }

        return request;
    }

    private BloodRequestResponse mapToResponse(BloodRequest request) {
        return BloodRequestResponse.builder()
                .id(request.getId())
                .requesterId(request.getRequester().getId())
                .requesterName(request.getRequester().getName())
                .requesterEmail(request.getRequester().getEmail())
                .donorId(request.getDonor().getId())
                .donorName(request.getDonor().getUser().getName())
                .donorPhone(request.getDonor().getPhone())
                .bloodGroup(request.getBloodGroup().getDisplayName())
                .hospitalName(request.getHospitalName())
                .city(request.getCity())
                .urgency(request.getUrgency().name())
                .status(request.getStatus().name())
                .message(request.getMessage())
                .createdAt(request.getCreatedAt())
                .updatedAt(request.getUpdatedAt())
                .build();
    }
}
