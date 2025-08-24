package com.ems.ems_backend.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationSummary {

    private long totalNotifications;
    private long unreadCount;
    private long highPriorityUnreadCount;
    private long urgentPriorityUnreadCount;
    private List<NotificationResponse> recentNotifications;

    public static NotificationSummary create(
            long totalNotifications,
            long unreadCount, 
            long highPriorityUnreadCount,
            long urgentPriorityUnreadCount,
            List<NotificationResponse> recentNotifications) {
        return NotificationSummary.builder()
                .totalNotifications(totalNotifications)
                .unreadCount(unreadCount)
                .highPriorityUnreadCount(highPriorityUnreadCount)
                .urgentPriorityUnreadCount(urgentPriorityUnreadCount)
                .recentNotifications(recentNotifications)
                .build();
    }
}
