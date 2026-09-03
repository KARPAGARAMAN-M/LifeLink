package com.lifelink.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DonorRegistrationRequest {

    // User account details (for combined registration)
    private String name;

    @Email(message = "Invalid email format")
    private String email;

    private String password;

    // Donor Personal Information
    private LocalDate dob;
    private Integer age;
    private String gender;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[0-9]{10,15}$", message = "Phone number must be valid digits")
    private String phone;

    // Blood Information
    @NotBlank(message = "Blood group is required")
    private String bloodGroup;
    private String rhFactor;

    // Location
    @NotBlank(message = "City is required")
    private String city;

    private String district;

    @NotBlank(message = "State is required")
    private String state;

    private String pincode;

    private Double latitude;
    private Double longitude;

    // Availability & Contact Preference
    @NotNull(message = "Availability status is required")
    private Boolean availability;

    private String preferredContactMethod;

    private LocalDate lastDonationDate;

    // Health Screening Answers (JSON or concatenated answers string)
    private String screeningAnswers;
}
