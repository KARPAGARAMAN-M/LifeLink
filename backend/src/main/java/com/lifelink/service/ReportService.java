package com.lifelink.service;

import com.lifelink.dto.request.ReportRequestDto;
import com.lifelink.dto.response.ReportResponseDto;
import com.lifelink.entity.Report;
import com.lifelink.entity.User;
import com.lifelink.exception.ResourceNotFoundException;
import com.lifelink.repository.ReportRepository;
import com.lifelink.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;

    @Transactional
    public ReportResponseDto createReport(Long reporterId, ReportRequestDto dto) {
        User reporter = userRepository.findById(reporterId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", reporterId));

        Report report = Report.builder()
                .reporter(reporter)
                .targetType(dto.getTargetType().toUpperCase())
                .targetId(dto.getTargetId())
                .reason(dto.getReason())
                .details(dto.getDetails())
                .status("PENDING")
                .build();

        Report saved = reportRepository.save(report);
        return mapToResponse(saved);
    }

    public List<ReportResponseDto> getAllReports() {
        return reportRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ReportResponseDto updateReportStatus(Long reportId, String status) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report", "id", reportId));
        report.setStatus(status.toUpperCase());
        Report updated = reportRepository.save(report);
        return mapToResponse(updated);
    }

    private ReportResponseDto mapToResponse(Report report) {
        return ReportResponseDto.builder()
                .id(report.getId())
                .reporterId(report.getReporter().getId())
                .reporterName(report.getReporter().getName())
                .reporterEmail(report.getReporter().getEmail())
                .targetType(report.getTargetType())
                .targetId(report.getTargetId())
                .reason(report.getReason())
                .details(report.getDetails())
                .status(report.getStatus())
                .createdAt(report.getCreatedAt())
                .build();
    }
}
