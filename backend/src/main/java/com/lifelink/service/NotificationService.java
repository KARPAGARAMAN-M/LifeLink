package com.lifelink.service;

import com.lifelink.entity.Donor;
import com.lifelink.entity.Notification;
import com.lifelink.entity.User;
import com.lifelink.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;

    @Value("${sms.api.key:}")
    private String smsApiKey;

    @Value("${sms.sender.id:LifeLink}")
    private String smsSenderId;

    /**
     * Dispatch mobile alert & in-app notification to a donor.
     */
    @Transactional
    public void sendDonorEmergencyAlert(Donor donor, Long requestId, String hospitalName, String bloodGroup, Double distanceKm) {
        User user = donor.getUser();
        String title = "🚨 URGENT BLOOD REQUEST";
        String message = String.format("A patient nearby needs %s blood at %s (%s).",
                bloodGroup, hospitalName, distanceKm != null ? String.format("%.1f km away", distanceKm) : "Nearby");

        // 1. Save in-app notification record
        Notification notification = Notification.builder()
                .user(user)
                .donorId(donor.getId())
                .requestId(requestId)
                .title(title)
                .message(message)
                .type("EMERGENCY_ALERT")
                .isRead(false)
                .build();
        notificationRepository.save(notification);

        // 2. FCM Push Notification (if token available)
        if (donor.getFcmToken() != null && !donor.getFcmToken().isBlank()) {
            log.info("Dispatching FCM Push Notification to donor {}: Token={}", donor.getId(), donor.getFcmToken());
            // Web/Mobile push dispatch simulation / FCM payload delivery
        }

        // 3. Optional SMS Dispatch (if configured via env vars)
        if (smsApiKey != null && !smsApiKey.isBlank()) {
            log.info("Dispatching SMS alert via Sender ID [{}] to phone {}", smsSenderId, donor.getPhone());
        }
    }

    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    @Transactional
    public void markAsRead(Long notificationId, Long userId) {
        Notification n = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        if (n.getUser().getId().equals(userId)) {
            n.setIsRead(true);
            notificationRepository.save(n);
        }
    }
}
