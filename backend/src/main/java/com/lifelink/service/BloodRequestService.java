package com.lifelink.service;

import com.lifelink.dto.request.BloodRequestCreateDto;
import com.lifelink.dto.request.EmergencyRequestDto;
import com.lifelink.dto.response.BloodRequestResponse;
import com.lifelink.entity.BloodRequest;
import com.lifelink.entity.Donor;
import com.lifelink.entity.User;
import com.lifelink.enums.BloodGroup;
import com.lifelink.enums.RequestStatus;
import com.lifelink.enums.Role;
import com.lifelink.enums.Urgency;
import com.lifelink.exception.ResourceNotFoundException;
import com.lifelink.exception.UnauthorizedException;
import com.lifelink.repository.BloodRequestRepository;
import com.lifelink.repository.DonorRepository;
import com.lifelink.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
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
    private final NotificationService notificationService;

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
                .unitsRequired(dto.getUnitsRequired() != null ? dto.getUnitsRequired() : 1)
                .contactNumber(dto.getContactNumber())
                .requiredDate(dto.getRequiredDate())
                .urgency(urgency)
                .status(RequestStatus.PENDING)
                .message(dto.getMessage())
                .build();

        BloodRequest saved = bloodRequestRepository.save(bloodRequest);

        // Dispatch FCM Push & In-App notification
        try {
            notificationService.sendDonorEmergencyAlert(donor, saved.getId(), dto.getHospitalName(), bloodGroup.getDisplayName(), null);
        } catch (Exception e) {
            // Ignore notification errors
        }

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
     * Create an emergency blood request from an unauthenticated guest seeker.
     */
    /**
     * Create an emergency or guest blood request from an unauthenticated seeker.
     */
    @Transactional
    public BloodRequestResponse createEmergencyGuestRequest(EmergencyRequestDto dto) {
        // Find targeted donor or default first active donor
        Donor donor;
        if (dto.getDonorId() != null) {
            donor = donorRepository.findById(dto.getDonorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Donor", "id", dto.getDonorId()));
        } else {
            List<Donor> activeDonors = donorRepository.findAllByOrderByCreatedAtDesc();
            if (activeDonors.isEmpty()) {
                throw new ResourceNotFoundException("No active donors found in network.");
            }
            donor = activeDonors.get(0);
        }

        BloodGroup bloodGroup = BloodGroup.fromDisplayName(dto.getBloodGroup());
        Urgency urgency = dto.getUrgency() != null ?
                Urgency.valueOf(dto.getUrgency().toUpperCase()) : Urgency.CRITICAL;

        String formattedMessage = "Requester Contact Phone: " + dto.getRequesterPhone() +
                (dto.getMessage() != null && !dto.getMessage().isEmpty() ? ("\n" + dto.getMessage()) : "");

        String generatedCode = "LL-REQ-" + (10000 + (int)(Math.random() * 90000));

        BloodRequest bloodRequest = BloodRequest.builder()
                .requestCode(generatedCode)
                .donor(donor)
                .requesterName(dto.getRequesterName())
                .requesterPhone(dto.getRequesterPhone())
                .requesterEmail(dto.getRequesterEmail())
                .bloodGroup(bloodGroup)
                .hospitalName(dto.getHospitalName())
                .city(dto.getCity())
                .unitsRequired(dto.getUnitsRequired() != null ? dto.getUnitsRequired() : 1)
                .contactNumber(dto.getContactNumber() != null ? dto.getContactNumber() : dto.getRequesterPhone())
                .requiredDate(dto.getRequiredDate() != null ? dto.getRequiredDate() : LocalDate.now())
                .urgency(urgency)
                .status(RequestStatus.PENDING)
                .message(formattedMessage)
                .build();

        BloodRequest saved = bloodRequestRepository.save(bloodRequest);

        try {
            notificationService.sendDonorEmergencyAlert(donor, saved.getId(), dto.getHospitalName(), bloodGroup.getDisplayName(), null);
        } catch (Exception e) {
            // Ignore notification errors
        }

        try {
            emailService.sendBloodRequestNotification(
                    donor.getUser().getEmail(),
                    donor.getUser().getName(),
                    dto.getRequesterName() + " (Phone: " + dto.getRequesterPhone() + ")",
                    bloodGroup.getDisplayName(),
                    dto.getHospitalName(),
                    urgency.name()
            );
        } catch (Exception e) {
            // Log & ignore email error
        }

        return mapToResponse(saved);
    }

    /**
     * Track request status using requestCode and phone number.
     */
    public BloodRequestResponse trackRequest(String requestCode, String phone) {
        BloodRequest request;
        if (requestCode != null && requestCode.startsWith("LL-REQ-")) {
            request = bloodRequestRepository.findByRequestCode(requestCode.trim())
                    .orElseThrow(() -> new ResourceNotFoundException("Blood request not found with Code: " + requestCode));
        } else {
            try {
                Long id = Long.parseLong(requestCode.trim().replaceAll("[^0-9]", ""));
                request = bloodRequestRepository.findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException("Blood request not found with ID: " + requestCode));
            } catch (Exception e) {
                throw new ResourceNotFoundException("Invalid Request ID format.");
            }
        }

        // Validate phone
        if (phone != null && !phone.trim().isEmpty()) {
            String inputPhone = phone.trim().replaceAll("[^0-9]", "");
            String reqPhone = request.getRequesterPhone() != null ? request.getRequesterPhone().replaceAll("[^0-9]", "") : "";
            String contactPhone = request.getContactNumber() != null ? request.getContactNumber().replaceAll("[^0-9]", "") : "";

            if (!reqPhone.isEmpty() && !reqPhone.endsWith(inputPhone) && !inputPhone.endsWith(reqPhone) &&
                !contactPhone.isEmpty() && !contactPhone.endsWith(inputPhone) && !inputPhone.endsWith(contactPhone)) {
                throw new UnauthorizedException("Phone number does not match the record for this Request ID.");
            }
        }

        return mapToResponse(request);
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
     * Cancel a pending blood request (requester action).
     */
    @Transactional
    public BloodRequestResponse cancelRequest(Long requestId, Long userId) {
        BloodRequest request = bloodRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Blood request", "id", requestId));

        if (!request.getRequester().getId().equals(userId)) {
            throw new UnauthorizedException("You can only cancel your own blood requests");
        }

        if (request.getStatus() != RequestStatus.PENDING) {
            throw new IllegalArgumentException("Only pending requests can be cancelled");
        }

        request.setStatus(RequestStatus.CANCELLED);
        BloodRequest updated = bloodRequestRepository.save(request);
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
     * Get completed donation history for a donor.
     */
    public List<BloodRequestResponse> getDonorHistory(Long userId) {
        return bloodRequestRepository.findByDonorUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .filter(r -> r.getStatus() == RequestStatus.COMPLETED || r.getStatus() == RequestStatus.ACCEPTED)
                .map(this::mapToResponse)
                .collect(Collectors.toList());
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
        Long reqId = request.getRequester() != null ? request.getRequester().getId() : null;
        String reqName = request.getRequesterName() != null ? request.getRequesterName() : (request.getRequester() != null ? request.getRequester().getName() : "Guest Seeker");
        String reqEmail = request.getRequesterEmail() != null ? request.getRequesterEmail() : (request.getRequester() != null ? request.getRequester().getEmail() : "");
        String reqPhone = request.getRequesterPhone() != null ? request.getRequesterPhone() : request.getContactNumber();
        String code = request.getRequestCode() != null ? request.getRequestCode() : ("LL-REQ-" + request.getId());

        return BloodRequestResponse.builder()
                .id(request.getId())
                .requestCode(code)
                .requesterId(reqId)
                .requesterName(reqName)
                .requesterEmail(reqEmail)
                .requesterPhone(reqPhone)
                .donorId(request.getDonor() != null ? request.getDonor().getId() : null)
                .donorName(request.getDonor() != null && request.getDonor().getUser() != null ? request.getDonor().getUser().getName() : "Available Donor")
                .donorPhone(request.getDonor() != null ? request.getDonor().getPhone() : null)
                .bloodGroup(request.getBloodGroup().getDisplayName())
                .hospitalName(request.getHospitalName())
                .city(request.getCity())
                .unitsRequired(request.getUnitsRequired())
                .contactNumber(request.getContactNumber())
                .requiredDate(request.getRequiredDate())
                .urgency(request.getUrgency().name())
                .status(request.getStatus().name())
                .message(request.getMessage())
                .createdAt(request.getCreatedAt())
                .updatedAt(request.getUpdatedAt())
                .build();
    }

}
