package com.lifelink.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * DTO for emergency blood requests submitted by unauthenticated seekers.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmergencyRequestDto {

    @NotNull(message = "Donor ID is required")
    private Long donorId;

    @NotBlank(message = "Blood group is required")
    private String bloodGroup;

    @NotBlank(message = "Hospital name is required")
    private String hospitalName;

    @NotBlank(message = "City is required")
    private String city;

    @Min(value = 1, message = "At least 1 unit of blood is required")
    private Integer unitsRequired;

    private String contactNumber;

    private LocalDate requiredDate;

    private String urgency; // NORMAL, URGENT, CRITICAL

    @NotBlank(message = "Requester name is required")
    private String requesterName;

    @NotBlank(message = "Requester contact phone is required")
    private String requesterPhone;

    private String requesterEmail;

    private String message;
}

