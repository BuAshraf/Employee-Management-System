package com.ems.ems_backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ems.ems_backend.dto.NotificationCreateRequest;
import com.ems.ems_backend.dto.NotificationResponse;
import com.ems.ems_backend.dto.NotificationSummary;
import com.ems.ems_backend.model.Notification;
import com.ems.ems_backend.model.User;
import com.ems.ems_backend.service.NotificationService;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/notifications")
@Slf4j
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    /**
     * Create a new notification
     * Only admins and HR can create notifications for other users
     */
        @PostMapping
        public ResponseEntity<NotificationResponse> createNotification(
                        @Valid @RequestBody NotificationCreateRequest request) {
                log.info("Creating notification for recipient: {}", request.getRecipientId());
                NotificationResponse response = notificationService.createNotification(request);
                return ResponseEntity.status(HttpStatus.CREATED).body(response);
        }

    /**
     * Get current user's notifications with pagination
     */
    @GetMapping
        public ResponseEntity<Page<NotificationResponse>> getUserNotifications(
                        @RequestParam Long userId,
                        @RequestParam(defaultValue = "0") int page,
                        @RequestParam(defaultValue = "20") int size) {
                Page<NotificationResponse> notifications = notificationService
                                .getUserNotifications(userId, page, size);
                return ResponseEntity.ok(notifications);
        }

    /**
     * Get current user's unread notifications
     */
    @GetMapping("/unread")
        public ResponseEntity<List<NotificationResponse>> getUnreadNotifications(
                        @RequestParam Long userId) {
                List<NotificationResponse> notifications = notificationService
                                .getUnreadNotifications(userId);
                return ResponseEntity.ok(notifications);
        }

    /**
     * Get notification summary for current user
     */
    @GetMapping("/summary")
        public ResponseEntity<NotificationSummary> getNotificationSummary(
                        @RequestParam Long userId) {
                NotificationSummary summary = notificationService
                                .getNotificationSummary(userId);
                return ResponseEntity.ok(summary);
        }

    /**
     * Get specific notification by ID
     */
    @GetMapping("/{id}")
        public ResponseEntity<NotificationResponse> getNotification(
                        @PathVariable Long id,
                        @RequestParam Long userId) {
                NotificationResponse notification = notificationService
                                .getNotification(id, userId);
                return ResponseEntity.ok(notification);
        }

    /**
     * Mark notification as read
     */
    @PutMapping("/{id}/read")
        public ResponseEntity<Void> markAsRead(
                        @PathVariable Long id,
                        @RequestParam Long userId) {
                notificationService.markAsRead(id, userId);
                return ResponseEntity.ok().build();
        }

    /**
     * Mark all notifications as read for current user
     */
    @PutMapping("/read-all")
        public ResponseEntity<Void> markAllAsRead(
                        @RequestParam Long userId) {
                notificationService.markAllAsRead(userId);
                return ResponseEntity.ok().build();
        }

    /**
     * Delete notification
     */
    @DeleteMapping("/{id}")
        public ResponseEntity<Void> deleteNotification(
                        @PathVariable Long id,
                        @RequestParam Long userId) {
                notificationService.deleteNotification(id, userId);
                return ResponseEntity.ok().build();
        }

    /**
     * Get filtered notifications
     */
    @GetMapping("/filter")
        public ResponseEntity<Page<NotificationResponse>> getFilteredNotifications(
                        @RequestParam Long userId,
                        @RequestParam(required = false) Boolean isRead,
                        @RequestParam(required = false) Notification.NotificationType type,
                        @RequestParam(required = false) Notification.NotificationPriority priority,
                        @RequestParam(defaultValue = "0") int page,
                        @RequestParam(defaultValue = "20") int size) {
                Page<NotificationResponse> notifications = notificationService
                                .getFilteredNotifications(userId, isRead, type, priority, page, size);
                return ResponseEntity.ok(notifications);
        }

    /**
     * Send notification to users with specific role
     * Only admins can use this endpoint
     */
        @PostMapping("/broadcast/role/{role}")
    public ResponseEntity<String> sendNotificationToRole(
            @PathVariable User.Role role,
            @RequestParam String title,
            @RequestParam String message,
            @RequestParam(defaultValue = "INFO") Notification.NotificationType type,
                        @RequestParam(defaultValue = "NORMAL") Notification.NotificationPriority priority) {
                log.info("Broadcasting notification to role: {}", role);
        notificationService.sendNotificationToRole(role, title, message, type, priority);
        return ResponseEntity.ok("Notification sent to all users with role: " + role);
    }

    /**
     * Send bulk notifications
     * Only admins and HR can use this endpoint
     */
        @PostMapping("/bulk")
    public ResponseEntity<String> sendBulkNotifications(
            @RequestParam List<Long> recipientIds,
            @RequestParam String title,
            @RequestParam String message,
            @RequestParam(defaultValue = "INFO") Notification.NotificationType type,
                        @RequestParam(defaultValue = "NORMAL") Notification.NotificationPriority priority) {
                log.info("Sending bulk notifications to {} users", recipientIds.size());
        notificationService.sendBulkNotifications(recipientIds, title, message, type, priority);
        return ResponseEntity.ok("Bulk notifications sent to " + recipientIds.size() + " users");
    }

    /**
     * Create system notification
     * Only admins can create system notifications
     */
        @PostMapping("/system")
    public ResponseEntity<String> createSystemNotification(
            @RequestParam Long recipientId,
            @RequestParam String title,
            @RequestParam String message,
            @RequestParam(defaultValue = "SYSTEM") Notification.NotificationType type,
                        @RequestParam(defaultValue = "NORMAL") Notification.NotificationPriority priority) {
                log.info("Creating system notification for user: {}", recipientId);
        notificationService.createSystemNotification(recipientId, title, message, type, priority);
        return ResponseEntity.ok("System notification created successfully");
    }
}
