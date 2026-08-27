package com.lifelink.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PublicStatsDto {

    private long totalUsers;
    private long activeDonors;
    private long totalRequests;
    private long completedRequests;
}
