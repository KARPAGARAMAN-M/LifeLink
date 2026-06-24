package com.lifelink.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BloodRequestCreateDto {

    @NotNull(message = "Donor ID is required")
    private Long donorId;

    @NotBlank(message = "Blood group is required")
    private String bloodGroup;

    @NotBlank(message = "Hospital name is required")
    private String hospitalName;

    @NotBlank(message = "City is required")
    private String city;

    private String urgency;

    private String message;
}
