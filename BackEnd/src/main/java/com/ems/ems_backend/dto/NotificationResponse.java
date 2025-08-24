package com.ems.ems_backend.dto;

import java.time.LocalDateTime;

import com.ems.ems_backend.model.Notification;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationResponse {

    private Long id;
    private String title;
    private String message;
    private Notification.NotificationType type;
    private Notification.NotificationPriority priority;
    private Boolean isRead;
    private LocalDateTime readAt;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
    private String actionUrl;
    private String actionLabel;
    private String recipientName;
    private String senderName;
    private Boolean isExpired;

    public static NotificationResponse fromNotification(Notification notification) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .type(notification.getType())
                .priority(notification.getPriority())
                .isRead(notification.getIsRead())
                .readAt(notification.getReadAt())
                .createdAt(notification.getCreatedAt())
                .expiresAt(notification.getExpiresAt())
                .actionUrl(notification.getActionUrl())
                .actionLabel(notification.getActionLabel())
                .recipientName(notification.getRecipientName())
                .senderName(notification.getSenderName())
                .isExpired(notification.isExpired())
                .build();
    }
}
