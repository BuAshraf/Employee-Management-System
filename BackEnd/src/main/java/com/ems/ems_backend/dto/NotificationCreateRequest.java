package com.ems.ems_backend.dto;

import java.time.LocalDateTime;

import com.ems.ems_backend.model.Notification;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationCreateRequest {

    @NotNull(message = "Recipient ID is required")
    private Long recipientId;

    private Long senderId; // Optional, can be null for system notifications

    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    private String title;

    @NotBlank(message = "Message is required")
    @Size(max = 1000, message = "Message must not exceed 1000 characters")
    private String message;

    private Notification.NotificationType type = Notification.NotificationType.INFO;

    private Notification.NotificationPriority priority = Notification.NotificationPriority.NORMAL;

    private LocalDateTime expiresAt;

    @Size(max = 100, message = "Action URL must not exceed 100 characters")
    private String actionUrl;

    @Size(max = 50, message = "Action label must not exceed 50 characters")
    private String actionLabel;
}
