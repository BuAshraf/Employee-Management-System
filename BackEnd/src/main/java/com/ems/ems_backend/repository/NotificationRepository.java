package com.ems.ems_backend.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ems.ems_backend.model.Notification;
import com.ems.ems_backend.model.User;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // Find notifications by recipient
    Page<Notification> findByRecipientOrderByCreatedAtDesc(User recipient, Pageable pageable);
    
    List<Notification> findByRecipientOrderByCreatedAtDesc(User recipient);

    // Find unread notifications
    Page<Notification> findByRecipientAndIsReadFalseOrderByCreatedAtDesc(User recipient, Pageable pageable);
    
    List<Notification> findByRecipientAndIsReadFalseOrderByCreatedAtDesc(User recipient);

    // Count unread notifications
    long countByRecipientAndIsReadFalse(User recipient);

    // Find notifications by type
    List<Notification> findByRecipientAndTypeOrderByCreatedAtDesc(User recipient, Notification.NotificationType type);

    // Find notifications by priority
    List<Notification> findByRecipientAndPriorityOrderByCreatedAtDesc(User recipient, Notification.NotificationPriority priority);

    // Find high priority unread notifications
    List<Notification> findByRecipientAndIsReadFalseAndPriorityInOrderByCreatedAtDesc(
        User recipient, 
        List<Notification.NotificationPriority> priorities
    );

    // Find notifications created within a date range
    List<Notification> findByRecipientAndCreatedAtBetweenOrderByCreatedAtDesc(
        User recipient, 
        LocalDateTime startDate, 
        LocalDateTime endDate
    );

    // Find expired notifications
    @Query("SELECT n FROM Notification n WHERE n.expiresAt IS NOT NULL AND n.expiresAt < :currentTime")
    List<Notification> findExpiredNotifications(@Param("currentTime") LocalDateTime currentTime);

    // Mark notification as read
    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true, n.readAt = :readTime WHERE n.id = :id")
    int markAsRead(@Param("id") Long id, @Param("readTime") LocalDateTime readTime);

    // Mark all notifications as read for a user
    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true, n.readAt = :readTime WHERE n.recipient = :recipient AND n.isRead = false")
    int markAllAsReadForUser(@Param("recipient") User recipient, @Param("readTime") LocalDateTime readTime);

    // Delete old read notifications
    @Modifying
    @Query("DELETE FROM Notification n WHERE n.isRead = true AND n.readAt < :cutoffDate")
    int deleteOldReadNotifications(@Param("cutoffDate") LocalDateTime cutoffDate);

    // Delete expired notifications
    @Modifying
    @Query("DELETE FROM Notification n WHERE n.expiresAt IS NOT NULL AND n.expiresAt < :currentTime")
    int deleteExpiredNotifications(@Param("currentTime") LocalDateTime currentTime);

    // Find notifications by sender
    List<Notification> findBySenderOrderByCreatedAtDesc(User sender);

    // Find system notifications (notifications without sender)
    List<Notification> findBySenderIsNullOrderByCreatedAtDesc();

    // Custom query to find notifications with specific criteria
    @Query("""
        SELECT n FROM Notification n 
        WHERE n.recipient = :recipient 
        AND (:isRead IS NULL OR n.isRead = :isRead)
        AND (:type IS NULL OR n.type = :type)
        AND (:priority IS NULL OR n.priority = :priority)
        AND (n.expiresAt IS NULL OR n.expiresAt > :currentTime)
        ORDER BY n.createdAt DESC
        """)
    Page<Notification> findNotificationsWithFilters(
        @Param("recipient") User recipient,
        @Param("isRead") Boolean isRead,
        @Param("type") Notification.NotificationType type,
        @Param("priority") Notification.NotificationPriority priority,
        @Param("currentTime") LocalDateTime currentTime,
        Pageable pageable
    );

    // Find recent notifications (last 7 days)
    @Query("SELECT n FROM Notification n WHERE n.recipient = :recipient AND n.createdAt >= :sevenDaysAgo ORDER BY n.createdAt DESC")
    List<Notification> findRecentNotifications(@Param("recipient") User recipient, @Param("sevenDaysAgo") LocalDateTime sevenDaysAgo);
}
