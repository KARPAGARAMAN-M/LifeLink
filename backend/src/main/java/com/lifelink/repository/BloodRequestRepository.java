package com.lifelink.repository;

import com.lifelink.entity.BloodRequest;
import com.lifelink.enums.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BloodRequestRepository extends JpaRepository<BloodRequest, Long> {

    List<BloodRequest> findByRequesterIdOrderByCreatedAtDesc(Long requesterId);

    List<BloodRequest> findByDonorIdOrderByCreatedAtDesc(Long donorId);

    List<BloodRequest> findByDonorUserIdOrderByCreatedAtDesc(Long userId);

    List<BloodRequest> findByStatusOrderByCreatedAtDesc(RequestStatus status);

    long countByStatus(RequestStatus status);

    List<BloodRequest> findAllByOrderByCreatedAtDesc();
}
