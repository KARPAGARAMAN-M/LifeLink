package com.lifelink.entity;

import com.lifelink.enums.BloodGroup;
import com.lifelink.enums.VerificationStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Donor entity representing registered blood donors.
 * Linked to a User via one-to-one relationship.
 */
@Entity
@Table(name = "donors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Donor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "blood_group", nullable = false)
    private BloodGroup bloodGroup;

    @Column(nullable = false, length = 100)
    private String city;

    @Column(length = 100)
    private String district;

    @Column(nullable = false, length = 100)
    private String state;

    @Column(length = 10)
    private String pincode;

    @Column(nullable = false, length = 15)
    private String phone;

    @Column
    private LocalDate dob;

    @Column
    private Integer age;

    @Column(length = 20)
    private String gender;

    @Column(name = "preferred_contact", length = 20)
    @Builder.Default
    private String preferredContactMethod = "PHONE";

    @Enumerated(EnumType.STRING)
    @Column(name = "verification_status", nullable = false)
    @Builder.Default
    private VerificationStatus verificationStatus = VerificationStatus.VERIFIED;

    @Builder.Default
    @Column(nullable = false)
    private Boolean availability = false;

    @Column(name = "fcm_token", columnDefinition = "TEXT")
    private String fcmToken;

    @Column(name = "screening_answers", columnDefinition = "TEXT")
    private String screeningAnswers;

    @Column(name = "notification_preferences", columnDefinition = "TEXT")
    private String notificationPreferences;

    @Column(name = "last_donation_date")
    private LocalDate lastDonationDate;

    @Column
    private Double latitude;

    @Column
    private Double longitude;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}

