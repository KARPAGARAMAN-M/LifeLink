package com.lifelink.service;

import com.lifelink.dto.response.PublicStatsDto;
import com.lifelink.enums.RequestStatus;
import com.lifelink.repository.BloodRequestRepository;
import com.lifelink.repository.DonorRepository;
import com.lifelink.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PublicService {

    private final UserRepository userRepository;
    private final DonorRepository donorRepository;
    private final BloodRequestRepository bloodRequestRepository;

    public PublicStatsDto getRealTimeStats() {
        long totalUsers = userRepository.count();
        long activeDonors = donorRepository.countByAvailabilityTrue();
        long totalRequests = bloodRequestRepository.count();
        long completedRequests = bloodRequestRepository.countByStatus(RequestStatus.COMPLETED)
                + bloodRequestRepository.countByStatus(RequestStatus.FULFILLED);

        return PublicStatsDto.builder()
                .totalUsers(totalUsers)
                .activeDonors(activeDonors)
                .totalRequests(totalRequests)
                .completedRequests(completedRequests)
                .build();
    }
}
