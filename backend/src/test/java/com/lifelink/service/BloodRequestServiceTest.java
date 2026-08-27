package com.lifelink.service;

import com.lifelink.dto.request.BloodRequestCreateDto;
import com.lifelink.dto.response.BloodRequestResponse;
import com.lifelink.entity.BloodRequest;
import com.lifelink.entity.Donor;
import com.lifelink.entity.User;
import com.lifelink.enums.BloodGroup;
import com.lifelink.enums.RequestStatus;
import com.lifelink.enums.Role;
import com.lifelink.enums.Urgency;
import com.lifelink.repository.BloodRequestRepository;
import com.lifelink.repository.DonorRepository;
import com.lifelink.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BloodRequestServiceTest {

    @Mock
    private BloodRequestRepository bloodRequestRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private DonorRepository donorRepository;

    private EmailService emailService = new EmailService(null) {
        @Override
        public void sendBloodRequestNotification(String toEmail, String donorName, String requesterName, String bloodGroup, String hospitalName, String urgency) {}
        @Override
        public void sendRequestAcceptedNotification(String toEmail, String requesterName, String donorName, String donorPhone) {}
        @Override
        public void sendRequestCompletedNotification(String toEmail, String requesterName, String donorName) {}
    };

    @InjectMocks
    private BloodRequestService bloodRequestService;


    private User requester;
    private User donorUser;
    private Donor donor;
    private BloodRequest bloodRequest;

    @BeforeEach
    void setUp() {
        requester = User.builder().id(1L).name("Requester User").email("req@example.com").role(Role.USER).build();
        donorUser = User.builder().id(2L).name("Donor User").email("donor@example.com").role(Role.USER).build();
        donor = Donor.builder().id(5L).user(donorUser).bloodGroup(BloodGroup.O_POSITIVE).phone("9876543210").build();

        bloodRequest = BloodRequest.builder()
                .id(100L)
                .requester(requester)
                .donor(donor)
                .bloodGroup(BloodGroup.O_POSITIVE)
                .hospitalName("City Hospital")
                .city("Chennai")
                .unitsRequired(2)
                .contactNumber("9876543210")
                .requiredDate(LocalDate.now().plusDays(1))
                .urgency(Urgency.URGENT)
                .status(RequestStatus.PENDING)
                .build();
    }

    @Test
    void createRequest_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(requester));
        when(donorRepository.findById(5L)).thenReturn(Optional.of(donor));
        when(bloodRequestRepository.save(any(BloodRequest.class))).thenReturn(bloodRequest);

        BloodRequestCreateDto dto = new BloodRequestCreateDto(
                5L, "O+", "City Hospital", "Chennai", 2, "9876543210", LocalDate.now().plusDays(1), "URGENT", "Please help"
        );

        BloodRequestResponse response = bloodRequestService.createRequest(1L, dto);

        assertNotNull(response);
        assertEquals("O+", response.getBloodGroup());
        assertEquals(2, response.getUnitsRequired());
        assertEquals(RequestStatus.PENDING.name(), response.getStatus());
        verify(bloodRequestRepository, times(1)).save(any(BloodRequest.class));
    }

    @Test
    void acceptRequest_Success() {
        when(bloodRequestRepository.findById(100L)).thenReturn(Optional.of(bloodRequest));
        when(bloodRequestRepository.save(any(BloodRequest.class))).thenReturn(bloodRequest);

        BloodRequestResponse response = bloodRequestService.acceptRequest(100L, 2L);

        assertNotNull(response);
        verify(bloodRequestRepository, times(1)).save(any(BloodRequest.class));
    }
}
