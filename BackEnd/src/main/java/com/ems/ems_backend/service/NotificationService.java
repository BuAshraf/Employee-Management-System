package com.ems.ems_backend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ems.ems_backend.dto.NotificationCreateRequest;
import com.ems.ems_backend.dto.NotificationResponse;
import com.ems.ems_backend.dto.NotificationSummary;
import com.ems.ems_backend.exception.NotFoundException;
import com.ems.ems_backend.model.Notification;
import com.ems.ems_backend.model.User;
import com.ems.ems_backend.repository.NotificationRepository;
import com.ems.ems_backend.repository.UserRepository;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@Transactional
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Create a new notification
     */
    public NotificationResponse createNotification(NotificationCreateRequest request) {
        User recipient = userRepository.findById(request.getRecipientId())
                .orElseThrow(() -> new NotFoundException("Recipient not found with id: " + request.getRecipientId()));

        User sender = null;
        if (request.getSenderId() != null) {
            sender = userRepository.findById(request.getSenderId())
                    .orElseThrow(() -> new NotFoundException("Sender not found with id: " + request.getSenderId()));
        }

        Notification notification = new Notification();
        notification.setRecipient(recipient);
        notification.setSender(sender);
        notification.setTitle(request.getTitle());
        notification.setMessage(request.getMessage());
        notification.setType(request.getType());
        notification.setPriority(request.getPriority());
        notification.setExpiresAt(request.getExpiresAt());
        notification.setActionUrl(request.getActionUrl());
        notification.setActionLabel(request.getActionLabel());

        Notification savedNotification = notificationRepository.save(notification);
        log.info("Created notification with id: {} for user: {}", savedNotification.getId(), recipient.getUsername());

        return NotificationResponse.fromNotification(savedNotification);
    }

    /**
     * Send notification to multiple users
     */
    @Async
    public void sendBulkNotifications(List<Long> recipientIds, String title, String message,
            Notification.NotificationType type, Notification.NotificationPriority priority) {
        recipientIds.forEach(recipientId -> {
            try {
                NotificationCreateRequest request = new NotificationCreateRequest();
                request.setRecipientId(recipientId);
                request.setTitle(title);
                request.setMessage(message);
                request.setType(type);
                request.setPriority(priority);
                createNotification(request);
            } catch (Exception e) {
                log.error("Failed to send notification to user id: {}", recipientId, e);
            }
        });
    }

    /**
     * Get notifications for a user with pagination
     */
    @Transactional(readOnly = true)
    public Page<NotificationResponse> getUserNotifications(Long userId, int page, int size) {
        User user = getUserById(userId);
        Pageable pageable = PageRequest.of(page, size);

        return notificationRepository.findByRecipientOrderByCreatedAtDesc(user, pageable)
                .map(NotificationResponse::fromNotification);
    }

    /**
     * Get unread notifications for a user
     */
    @Transactional(readOnly = true)
    public List<NotificationResponse> getUnreadNotifications(Long userId) {
        User user = getUserById(userId);

        return notificationRepository.findByRecipientAndIsReadFalseOrderByCreatedAtDesc(user)
                .stream()
                .map(NotificationResponse::fromNotification)
                .collect(Collectors.toList());
    }

    /**
     * Get notification summary for a user
     */
    @Transactional(readOnly = true)
    public NotificationSummary getNotificationSummary(Long userId) {
        User user = getUserById(userId);

        long totalNotifications = notificationRepository.findByRecipientOrderByCreatedAtDesc(user).size();
        long unreadCount = notificationRepository.countByRecipientAndIsReadFalse(user);

        List<Notification.NotificationPriority> highPriorities = List.of(Notification.NotificationPriority.HIGH);
        List<Notification.NotificationPriority> urgentPriorities = List.of(Notification.NotificationPriority.URGENT);

        long highPriorityUnreadCount = notificationRepository
                .findByRecipientAndIsReadFalseAndPriorityInOrderByCreatedAtDesc(user, highPriorities).size();

        long urgentPriorityUnreadCount = notificationRepository
                .findByRecipientAndIsReadFalseAndPriorityInOrderByCreatedAtDesc(user, urgentPriorities).size();

        // Get recent notifications (last 5)
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        List<NotificationResponse> recentNotifications = notificationRepository
                .findRecentNotifications(user, sevenDaysAgo)
                .stream()
                .limit(5)
                .map(NotificationResponse::fromNotification)
                .collect(Collectors.toList());

        return NotificationSummary.create(
                totalNotifications,
                unreadCount,
                highPriorityUnreadCount,
                urgentPriorityUnreadCount,
                recentNotifications
        );
    }

    /**
     * Mark notification as read
     */
    public void markAsRead(Long notificationId, Long userId) {
        Notification notification = getNotificationById(notificationId);

        // Verify the notification belongs to the user
        if (!notification.getRecipient().getId().equals(userId)) {
            throw new SecurityException("User can only mark their own notifications as read");
        }

        if (!notification.getIsRead()) {
            notification.markAsRead();
            notificationRepository.save(notification);
            log.info("Marked notification {} as read for user {}", notificationId, userId);
        }
    }

    /**
     * Mark all notifications as read for a user
     */
    public void markAllAsRead(Long userId) {
        User user = getUserById(userId);
        int updatedCount = notificationRepository.markAllAsReadForUser(user, LocalDateTime.now());
        log.info("Marked {} notifications as read for user {}", updatedCount, userId);
    }

    /**
     * Delete notification
     */
    public void deleteNotification(Long notificationId, Long userId) {
        Notification notification = getNotificationById(notificationId);

        // Verify the notification belongs to the user
        if (!notification.getRecipient().getId().equals(userId)) {
            throw new SecurityException("User can only delete their own notifications");
        }

        notificationRepository.delete(notification);
        log.info("Deleted notification {} for user {}", notificationId, userId);
    }

    /**
     * Get notifications with filters
     */
    @Transactional(readOnly = true)
    public Page<NotificationResponse> getFilteredNotifications(
            Long userId, Boolean isRead, Notification.NotificationType type,
            Notification.NotificationPriority priority, int page, int size) {

        User user = getUserById(userId);
        Pageable pageable = PageRequest.of(page, size);

        return notificationRepository.findNotificationsWithFilters(
                user, isRead, type, priority, LocalDateTime.now(), pageable)
                .map(NotificationResponse::fromNotification);
    }

    /**
     * Create system notification (no sender)
     */
    public void createSystemNotification(Long recipientId, String title, String message,
            Notification.NotificationType type, Notification.NotificationPriority priority) {
        NotificationCreateRequest request = new NotificationCreateRequest();
        request.setRecipientId(recipientId);
        request.setTitle(title);
        request.setMessage(message);
        request.setType(type);
        request.setPriority(priority);

        createNotification(request);
    }

    /**
     * Send notification to all users with specific roles
     */
    @Async
    public void sendNotificationToRole(User.Role role, String title, String message,
            Notification.NotificationType type, Notification.NotificationPriority priority) {
        List<User> usersWithRole = userRepository.findByRole(role);
        List<Long> userIds = usersWithRole.stream()
                .map(User::getId)
                .collect(Collectors.toList());

        sendBulkNotifications(userIds, title, message, type, priority);
    }

    /**
     * Scheduled task to clean up old read notifications (runs daily at 2 AM)
     */
    @Scheduled(cron = "0 0 2 * * ?")
    public void cleanupOldNotifications() {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(30); // Delete notifications older than 30 days
        int deletedCount = notificationRepository.deleteOldReadNotifications(cutoffDate);
        log.info("Cleaned up {} old read notifications", deletedCount);
    }

    /**
     * Scheduled task to clean up expired notifications (runs every hour)
     */
    @Scheduled(cron = "0 0 * * * ?")
    public void cleanupExpiredNotifications() {
        int deletedCount = notificationRepository.deleteExpiredNotifications(LocalDateTime.now());
        if (deletedCount > 0) {
            log.info("Cleaned up {} expired notifications", deletedCount);
        }
    }

    // Helper methods
    private User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found with id: " + userId));
    }

    private Notification getNotificationById(Long notificationId) {
        return notificationRepository.findById(notificationId)
                .orElseThrow(() -> new NotFoundException("Notification not found with id: " + notificationId));
    }

    /**
     * Get notification by ID for a specific user
     */
    @Transactional(readOnly = true)
    public NotificationResponse getNotification(Long notificationId, Long userId) {
        Notification notification = getNotificationById(notificationId);

        // Verify the notification belongs to the user
        if (!notification.getRecipient().getId().equals(userId)) {
            throw new SecurityException("User can only access their own notifications");
        }

        return NotificationResponse.fromNotification(notification);
    }
}
