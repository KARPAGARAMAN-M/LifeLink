package com.lifelink.controller;

import com.lifelink.dto.request.ReportRequestDto;
import com.lifelink.dto.response.ApiResponse;
import com.lifelink.dto.response.ReportResponseDto;
import com.lifelink.entity.User;
import com.lifelink.service.ReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @PostMapping
    public ResponseEntity<ApiResponse<ReportResponseDto>> createReport(
            @AuthenticationPrincipal User currentUser,
            @Valid @RequestBody ReportRequestDto dto) {
        ReportResponseDto response = reportService.createReport(currentUser.getId(), dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Report submitted successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ReportResponseDto>>> getAllReports() {
        List<ReportResponseDto> reports = reportService.getAllReports();
        return ResponseEntity.ok(ApiResponse.success("Reports retrieved successfully", reports));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<ReportResponseDto>> updateReportStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        ReportResponseDto updated = reportService.updateReportStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Report status updated", updated));
    }

}
