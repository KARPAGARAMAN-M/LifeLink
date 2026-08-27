package com.lifelink.controller;

import com.lifelink.dto.response.ApiResponse;
import com.lifelink.dto.response.PublicStatsDto;
import com.lifelink.service.PublicService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicController {

    private final PublicService publicService;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<PublicStatsDto>> getPublicStats() {
        PublicStatsDto stats = publicService.getRealTimeStats();
        return ResponseEntity.ok(ApiResponse.success("Real-time public statistics", stats));
    }
}
