package com.lifelink.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

/**
 * Asynchronous email notification service.
 * Sends emails for key events: registration, blood requests, acceptance, completion.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    private static final String FROM_EMAIL = "noreply@lifelink.com";

    /**
     * Send welcome email upon user registration.
     */
    @Async
    public void sendWelcomeEmail(String to, String name) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(FROM_EMAIL);
            message.setTo(to);
            message.setSubject("Welcome to LifeLink! 🩸");
            message.setText(String.format(
                    "Dear %s,\n\n" +
                    "Welcome to LifeLink – Smart Blood Donor Management System!\n\n" +
                    "Thank you for joining our platform. Together, we can save lives.\n\n" +
                    "You can now:\n" +
                    "• Register as a blood donor\n" +
                    "• Search for available donors\n" +
                    "• Send blood requests during emergencies\n\n" +
                    "Every drop counts. Thank you for being a hero!\n\n" +
                    "Best regards,\n" +
                    "The LifeLink Team", name
            ));
            mailSender.send(message);
            log.info("Welcome email sent to: {}", to);
        } catch (Exception e) {
            log.error("Failed to send welcome email to {}: {}", to, e.getMessage());
        }
    }

    /**
     * Notify donor of a new blood request.
     */
    @Async
    public void sendBloodRequestNotification(String donorEmail, String donorName,
                                              String requesterName, String bloodGroup,
                                              String hospitalName, String urgency) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(FROM_EMAIL);
            message.setTo(donorEmail);
            message.setSubject("🚨 New Blood Request – " + urgency + " Priority");
            message.setText(String.format(
                    "Dear %s,\n\n" +
                    "You have received a new blood request!\n\n" +
                    "Details:\n" +
                    "• Requester: %s\n" +
                    "• Blood Group Needed: %s\n" +
                    "• Hospital: %s\n" +
                    "• Urgency: %s\n\n" +
                    "Please log in to LifeLink to accept or decline this request.\n\n" +
                    "Thank you for saving lives!\n\n" +
                    "Best regards,\n" +
                    "The LifeLink Team",
                    donorName, requesterName, bloodGroup, hospitalName, urgency
            ));
            mailSender.send(message);
            log.info("Blood request notification sent to: {}", donorEmail);
        } catch (Exception e) {
            log.error("Failed to send blood request notification to {}: {}", donorEmail, e.getMessage());
        }
    }

    /**
     * Notify requester that their blood request has been accepted.
     */
    @Async
    public void sendRequestAcceptedNotification(String requesterEmail, String requesterName,
                                                 String donorName, String donorPhone) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(FROM_EMAIL);
            message.setTo(requesterEmail);
            message.setSubject("✅ Blood Request Accepted!");
            message.setText(String.format(
                    "Dear %s,\n\n" +
                    "Great news! Your blood request has been accepted!\n\n" +
                    "Donor Details:\n" +
                    "• Name: %s\n" +
                    "• Contact: %s\n\n" +
                    "Please coordinate with the donor for the blood donation.\n\n" +
                    "Best regards,\n" +
                    "The LifeLink Team",
                    requesterName, donorName, donorPhone
            ));
            mailSender.send(message);
            log.info("Request accepted notification sent to: {}", requesterEmail);
        } catch (Exception e) {
            log.error("Failed to send acceptance notification to {}: {}", requesterEmail, e.getMessage());
        }
    }

    /**
     * Notify requester that the blood donation is completed.
     */
    @Async
    public void sendRequestCompletedNotification(String requesterEmail, String requesterName,
                                                  String donorName) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(FROM_EMAIL);
            message.setTo(requesterEmail);
            message.setSubject("🎉 Blood Donation Completed!");
            message.setText(String.format(
                    "Dear %s,\n\n" +
                    "The blood donation request has been successfully completed!\n\n" +
                    "Donor: %s\n\n" +
                    "Thank you for using LifeLink. We're glad we could help!\n\n" +
                    "Best regards,\n" +
                    "The LifeLink Team",
                    requesterName, donorName
            ));
            mailSender.send(message);
            log.info("Request completed notification sent to: {}", requesterEmail);
        } catch (Exception e) {
            log.error("Failed to send completion notification to {}: {}", requesterEmail, e.getMessage());
        }
    }
}
