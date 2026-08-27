package com.lifelink.service;

import com.lifelink.dto.request.DonorRegistrationRequest;
import com.lifelink.dto.response.DonorResponse;
import com.lifelink.entity.Donor;
import com.lifelink.entity.User;
import com.lifelink.enums.BloodGroup;
import com.lifelink.enums.Role;
import com.lifelink.enums.VerificationStatus;
import com.lifelink.exception.DuplicateResourceException;
import com.lifelink.exception.ResourceNotFoundException;
import com.lifelink.repository.DonorRepository;
import com.lifelink.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DonorServiceTest {

    @Mock
    private DonorRepository donorRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private DonorService donorService;

    private User sampleUser;
    private Donor sampleDonor;
    private DonorRegistrationRequest registrationRequest;

    @BeforeEach
    void setUp() {
        sampleUser = User.builder()
                .id(1L)
                .name("Ramesh Kumar")
                .email("ramesh@example.com")
                .password("hashed_pwd")
                .role(Role.USER)
                .isBlocked(false)
                .build();

        sampleDonor = Donor.builder()
                .id(10L)
                .user(sampleUser)
                .bloodGroup(BloodGroup.O_POSITIVE)
                .city("Chennai")
                .state("Tamil Nadu")
                .phone("9876543210")
                .age(28)
                .gender("Male")
                .preferredContactMethod("PHONE")
                .verificationStatus(VerificationStatus.VERIFIED)
                .availability(true)
                .latitude(13.0827)
                .longitude(80.2707)
                .build();

        registrationRequest = new DonorRegistrationRequest(
                "O+", "Chennai", "Tamil Nadu", "9876543210", 28, "Male", "PHONE", true, null, 13.0827, 80.2707
        );
    }

    @Test
    void registerDonor_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(donorRepository.existsByUserId(1L)).thenReturn(false);
        when(donorRepository.save(any(Donor.class))).thenReturn(sampleDonor);

        DonorResponse response = donorService.registerDonor(1L, registrationRequest);

        assertNotNull(response);
        assertEquals("O+", response.getBloodGroup());
        assertEquals("Chennai", response.getCity());
        assertEquals(28, response.getAge());
        verify(donorRepository, times(1)).save(any(Donor.class));
    }

    @Test
    void registerDonor_ThrowsException_WhenAlreadyRegistered() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(donorRepository.existsByUserId(1L)).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> donorService.registerDonor(1L, registrationRequest));
        verify(donorRepository, never()).save(any(Donor.class));
    }

    @Test
    void searchDonors_MasksPhoneNumber_ForPrivacy() {
        when(donorRepository.searchDonors(eq(BloodGroup.O_POSITIVE), eq("Chennai"), eq(null)))
                .thenReturn(List.of(sampleDonor));

        List<DonorResponse> results = donorService.searchDonors("O+", "Chennai", null, null, null, null);

        assertFalse(results.isEmpty());
        assertEquals("******3210", results.get(0).getPhone()); // Privacy masking verified
    }

    @Test
    void updateVerificationStatus_Success() {
        when(donorRepository.findById(10L)).thenReturn(Optional.of(sampleDonor));
        when(donorRepository.save(any(Donor.class))).thenReturn(sampleDonor);

        DonorResponse response = donorService.updateVerificationStatus(10L, VerificationStatus.VERIFIED);

        assertNotNull(response);
        assertEquals(VerificationStatus.VERIFIED.name(), response.getVerificationStatus());
    }
}
