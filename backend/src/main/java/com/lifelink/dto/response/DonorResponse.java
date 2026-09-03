package com.lifelink.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DonorResponse {

    private Long id;
    private Long userId;
    private String name;
    private String email;
    private String bloodGroup;
    private String city;
    private String district;
    private String state;
    private String pincode;
    private String phone;
    private LocalDate dob;
    private Integer age;
    private String gender;
    private String preferredContactMethod;
    private String verificationStatus;
    private Boolean availability;
    private String fcmToken;
    private String screeningAnswers;
    private String notificationPreferences;
    private LocalDate lastDonationDate;
    private Double latitude;
    private Double longitude;
    private LocalDateTime createdAt;
}
