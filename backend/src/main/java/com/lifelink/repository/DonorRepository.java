package com.lifelink.repository;

import com.lifelink.entity.Donor;
import com.lifelink.enums.BloodGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DonorRepository extends JpaRepository<Donor, Long> {

    Optional<Donor> findByUserId(Long userId);

    boolean existsByUserId(Long userId);

    List<Donor> findByBloodGroupAndAvailabilityTrue(BloodGroup bloodGroup);

    List<Donor> findByAvailabilityTrue();

    long countByAvailabilityTrue();

    @Query("SELECT d FROM Donor d WHERE " +
            "(:bloodGroup IS NULL OR d.bloodGroup = :bloodGroup) AND " +
            "(:city IS NULL OR LOWER(d.city) LIKE LOWER(CONCAT('%', :city, '%'))) AND " +
            "(:state IS NULL OR LOWER(d.state) LIKE LOWER(CONCAT('%', :state, '%'))) AND " +
            "d.availability = true " +
            "ORDER BY d.createdAt DESC")
    List<Donor> searchDonors(
            @Param("bloodGroup") BloodGroup bloodGroup,
            @Param("city") String city,
            @Param("state") String state
    );

    @Query("SELECT d.bloodGroup, COUNT(d) FROM Donor d GROUP BY d.bloodGroup")
    List<Object[]> getBloodGroupDistribution();

    List<Donor> findAllByOrderByCreatedAtDesc();
}
