package com.lifelink.service;

import com.lifelink.dto.request.DonorRegistrationRequest;
import com.lifelink.dto.response.DonorResponse;
import com.lifelink.entity.Donor;
import com.lifelink.entity.User;
import com.lifelink.enums.BloodGroup;
import com.lifelink.exception.DuplicateResourceException;
import com.lifelink.exception.ResourceNotFoundException;
import com.lifelink.repository.DonorRepository;
import com.lifelink.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for donor registration, profile management, and search operations.
 */
@Service
@RequiredArgsConstructor
public class DonorService {

    private final DonorRepository donorRepository;
    private final UserRepository userRepository;

    /**
     * Register the currently authenticated user as a donor.
     */
    @Transactional
    public DonorResponse registerDonor(Long userId, DonorRegistrationRequest request) {
        // Check if user exists
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        // Check if already registered as donor
        if (donorRepository.existsByUserId(userId)) {
            throw new DuplicateResourceException("You are already registered as a donor");
        }

        BloodGroup bloodGroup = BloodGroup.fromDisplayName(request.getBloodGroup());

        Donor donor = Donor.builder()
                .user(user)
                .bloodGroup(bloodGroup)
                .city(request.getCity())
                .state(request.getState())
                .phone(request.getPhone())
                .availability(request.getAvailability())
                .lastDonationDate(request.getLastDonationDate())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .build();

        Donor savedDonor = donorRepository.save(donor);
        return mapToResponse(savedDonor);
    }

    /**
     * Update existing donor profile.
     */
    @Transactional
    public DonorResponse updateDonor(Long userId, DonorRegistrationRequest request) {
        Donor donor = donorRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Donor profile not found"));

        if (request.getBloodGroup() != null) {
            donor.setBloodGroup(BloodGroup.fromDisplayName(request.getBloodGroup()));
        }
        if (request.getCity() != null) donor.setCity(request.getCity());
        if (request.getState() != null) donor.setState(request.getState());
        if (request.getPhone() != null) donor.setPhone(request.getPhone());
        if (request.getAvailability() != null) donor.setAvailability(request.getAvailability());
        if (request.getLastDonationDate() != null) donor.setLastDonationDate(request.getLastDonationDate());
        if (request.getLatitude() != null) donor.setLatitude(request.getLatitude());
        if (request.getLongitude() != null) donor.setLongitude(request.getLongitude());

        Donor updatedDonor = donorRepository.save(donor);
        return mapToResponse(updatedDonor);
    }

    /**
     * Search donors with optional filters (blood group, city, state).
     */
    public List<DonorResponse> searchDonors(String bloodGroupStr, String city, String state) {
        BloodGroup bloodGroup = null;
        if (bloodGroupStr != null && !bloodGroupStr.isEmpty()) {
            bloodGroup = BloodGroup.fromDisplayName(bloodGroupStr);
        }

        String cityParam = (city != null && !city.isEmpty()) ? city : null;
        String stateParam = (state != null && !state.isEmpty()) ? state : null;

        List<Donor> donors = donorRepository.searchDonors(bloodGroup, cityParam, stateParam);
        return donors.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get a specific donor by ID.
     */
    public DonorResponse getDonorById(Long id) {
        Donor donor = donorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Donor", "id", id));
        return mapToResponse(donor);
    }

    /**
     * Get donor profile for the authenticated user.
     */
    public DonorResponse getDonorByUserId(Long userId) {
        Donor donor = donorRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Donor profile not found"));
        return mapToResponse(donor);
    }

    /**
     * Toggle donor availability status.
     */
    @Transactional
    public DonorResponse toggleAvailability(Long userId) {
        Donor donor = donorRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Donor profile not found"));
        donor.setAvailability(!donor.getAvailability());
        Donor updated = donorRepository.save(donor);
        return mapToResponse(updated);
    }

    /**
     * Check if user is registered as a donor.
     */
    public boolean isDonor(Long userId) {
        return donorRepository.existsByUserId(userId);
    }

    /**
     * Get all donors (for admin).
     */
    public List<DonorResponse> getAllDonors() {
        return donorRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Map Donor entity to DonorResponse DTO.
     */
    private DonorResponse mapToResponse(Donor donor) {
        return DonorResponse.builder()
                .id(donor.getId())
                .userId(donor.getUser().getId())
                .name(donor.getUser().getName())
                .email(donor.getUser().getEmail())
                .bloodGroup(donor.getBloodGroup().getDisplayName())
                .city(donor.getCity())
                .state(donor.getState())
                .phone(donor.getPhone())
                .availability(donor.getAvailability())
                .lastDonationDate(donor.getLastDonationDate())
                .latitude(donor.getLatitude())
                .longitude(donor.getLongitude())
                .createdAt(donor.getCreatedAt())
                .build();
    }
}
