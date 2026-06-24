package com.lifelink.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

/**
 * Dashboard statistics response for admin analytics.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStats {

    private long totalUsers;
    private long totalDonors;
    private long activeDonors;
    private long totalRequests;
    private long pendingRequests;
    private long completedRequests;
    private long acceptedRequests;
    private long rejectedRequests;
    private Map<String, Long> bloodGroupDistribution;
}
