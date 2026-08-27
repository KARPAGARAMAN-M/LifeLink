package com.lifelink.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReportResponseDto {

    private Long id;
    private Long reporterId;
    private String reporterName;
    private String reporterEmail;
    private String targetType;
    private Long targetId;
    private String reason;
    private String details;
    private String status;
    private LocalDateTime createdAt;
}
