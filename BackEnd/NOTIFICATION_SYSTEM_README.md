# Notification System Documentation

## Overview

The Employee Management System now includes a comprehensive notification system that allows users to receive, manage, and send notifications throughout the application. This system supports different types of notifications, priorities, and automated event-driven notifications.

## Features

### Core Features
- ✅ Create and send notifications
- ✅ Real-time notification management
- ✅ Notification types and priorities
- ✅ Bulk notifications
- ✅ Role-based notifications
- ✅ System notifications
- ✅ Notification filtering and pagination
- ✅ Automatic cleanup of old notifications
- ✅ Event-driven notifications

### Notification Types
- `INFO` - General information
- `SUCCESS` - Success messages
- `WARNING` - Warning messages  
- `ERROR` - Error notifications
- `SYSTEM` - System-level notifications
- `EMPLOYEE_UPDATE` - Employee profile updates
- `DEPARTMENT_UPDATE` - Department changes
- `ROLE_CHANGE` - User role modifications
- `LEAVE_REQUEST` - Leave/vacation requests
- `PAYROLL` - Payroll-related notifications
- `BIRTHDAY` - Birthday reminders
- `ANNIVERSARY` - Work anniversary reminders
- `TASK_ASSIGNMENT` - Task assignments
- `MEETING_REMINDER` - Meeting reminders
- `DEADLINE_REMINDER` - Deadline notifications

### Priority Levels
- `LOW` - Low priority notifications
- `NORMAL` - Standard notifications
- `HIGH` - High priority notifications
- `URGENT` - Urgent notifications requiring immediate attention

## Database Schema

### Notifications Table
```sql
CREATE TABLE notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    recipient_id BIGINT NOT NULL,
    sender_id BIGINT,
    title VARCHAR(200) NOT NULL,
    message VARCHAR(1000) NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'INFO',
    priority VARCHAR(20) NOT NULL DEFAULT 'NORMAL',
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL,
    action_url VARCHAR(100),
    action_label VARCHAR(50),
    FOREIGN KEY (recipient_id) REFERENCES users(id),
    FOREIGN KEY (sender_id) REFERENCES users(id)
);
```

## API Endpoints

### User Notification Endpoints

#### Get User Notifications
```http
GET /api/notifications?page=0&size=20
Authorization: Bearer {token}
```

#### Get Unread Notifications
```http
GET /api/notifications/unread
Authorization: Bearer {token}
```

#### Get Notification Summary
```http
GET /api/notifications/summary
Authorization: Bearer {token}
```
Returns:
```json
{
    "totalNotifications": 25,
    "unreadCount": 5,
    "highPriorityUnreadCount": 2,
    "urgentPriorityUnreadCount": 1,
    "recentNotifications": [...]
}
```

#### Get Specific Notification
```http
GET /api/notifications/{id}
Authorization: Bearer {token}
```

#### Mark Notification as Read
```http
PUT /api/notifications/{id}/read
Authorization: Bearer {token}
```

#### Mark All Notifications as Read
```http
PUT /api/notifications/read-all
Authorization: Bearer {token}
```

#### Delete Notification
```http
DELETE /api/notifications/{id}
Authorization: Bearer {token}
```

#### Get Filtered Notifications
```http
GET /api/notifications/filter?isRead=false&type=INFO&priority=HIGH&page=0&size=10
Authorization: Bearer {token}
```

### Admin/HR Notification Endpoints

#### Create Notification
```http
POST /api/notifications
Authorization: Bearer {token}
Content-Type: application/json

{
    "recipientId": 1,
    "senderId": 2,
    "title": "Important Update",
    "message": "Please review the new policy document",
    "type": "INFO",
    "priority": "HIGH",
    "expiresAt": "2024-12-31T23:59:59",
    "actionUrl": "/policies/new-policy",
    "actionLabel": "View Policy"
}
```

#### Send Bulk Notifications
```http
POST /api/notifications/bulk
Authorization: Bearer {token}
Content-Type: application/x-www-form-urlencoded

recipientIds=1,2,3,4,5&title=Company Update&message=Important company announcement&type=INFO&priority=NORMAL
```

#### Send Role-Based Notifications
```http
POST /api/notifications/broadcast/role/MANAGER
Authorization: Bearer {token}
Content-Type: application/x-www-form-urlencoded

title=Manager Meeting&message=Monthly manager meeting tomorrow at 10 AM&type=MEETING_REMINDER&priority=HIGH
```

#### Create System Notification
```http
POST /api/notifications/system
Authorization: Bearer {token}
Content-Type: application/x-www-form-urlencoded

recipientId=1&title=System Maintenance&message=Scheduled maintenance tonight&type=SYSTEM&priority=HIGH
```

## Permission Requirements

### Required Roles
- **View own notifications**: All authenticated users
- **Create notifications**: `ADMIN`, `HR`
- **Send bulk notifications**: `ADMIN`, `HR`  
- **Send role-based notifications**: `ADMIN`
- **Create system notifications**: `ADMIN`

## Automated Notifications

The system automatically sends notifications for various events:

### Welcome Notifications
- Sent to new users when their account is created
- Type: `SUCCESS`, Priority: `NORMAL`

### Profile Updates
- Sent when user profile is modified
- Type: `INFO`, Priority: `NORMAL`

### Role Changes
- Sent when user role is changed
- Type: `WARNING`, Priority: `HIGH`

### New Employee Notifications
- Sent to managers, department heads, and HR when new employee is added
- Type: `INFO`, Priority: `NORMAL`

### Birthday Reminders
- Sent to HR and managers about employee birthdays
- Type: `BIRTHDAY`, Priority: `LOW`

### Work Anniversary Reminders
- Sent to HR and managers about work anniversaries
- Type: `ANNIVERSARY`, Priority: `LOW`

### System Maintenance
- Sent to all users before scheduled maintenance
- Type: `SYSTEM`, Priority: `HIGH`

### Security Notifications
- Password changes: Type: `WARNING`, Priority: `HIGH`
- Account locks: Type: `ERROR`, Priority: `URGENT`

## Service Classes

### NotificationService
Main service for notification operations:
- `createNotification()` - Create single notification
- `sendBulkNotifications()` - Send to multiple users
- `getUserNotifications()` - Get user's notifications with pagination
- `getUnreadNotifications()` - Get unread notifications
- `getNotificationSummary()` - Get notification counts and recent items
- `markAsRead()` - Mark notification as read
- `markAllAsRead()` - Mark all user notifications as read
- `deleteNotification()` - Delete notification
- `getFilteredNotifications()` - Get filtered notifications
- `sendNotificationToRole()` - Send to all users with specific role

### NotificationEventService
Handles automated event-driven notifications:
- `sendWelcomeNotification()` - Welcome new users
- `sendProfileUpdateNotification()` - Profile change notifications
- `sendRoleChangeNotification()` - Role change notifications
- `notifyManagersAboutNewEmployee()` - New employee notifications
- `sendBirthdayNotifications()` - Birthday reminders
- `sendAnniversaryNotifications()` - Anniversary reminders
- `sendMaintenanceNotification()` - System maintenance alerts
- `sendUrgentAdminAlert()` - Urgent admin notifications
- `sendPasswordChangeNotification()` - Password change alerts
- `sendAccountLockNotification()` - Account lock notifications

## Scheduled Tasks

### Automatic Cleanup
- **Old Notifications**: Deletes read notifications older than 30 days (runs daily at 2 AM)
- **Expired Notifications**: Deletes expired notifications (runs hourly)

### Configuration
```java
@Scheduled(cron = "0 0 2 * * ?") // Daily at 2 AM
public void cleanupOldNotifications()

@Scheduled(cron = "0 0 * * * ?") // Every hour
public void cleanupExpiredNotifications()
```

## Integration Examples

### Sending Notification from Service
```java
@Autowired
private NotificationService notificationService;

// Create notification
NotificationCreateRequest request = new NotificationCreateRequest();
request.setRecipientId(userId);
request.setTitle("Task Completed");
request.setMessage("Your task has been completed successfully");
request.setType(Notification.NotificationType.SUCCESS);
request.setPriority(Notification.NotificationPriority.NORMAL);

notificationService.createNotification(request);
```

### Using Event-Driven Notifications
```java
@Autowired
private NotificationEventService notificationEventService;

// Send welcome notification
notificationEventService.sendWelcomeNotification(newUser);

// Notify about role change
notificationEventService.sendRoleChangeNotification(user, oldRole, newRole, "Admin");

// Send birthday notifications
List<Employee> birthdayEmployees = getBirthdayEmployees();
notificationEventService.sendBirthdayNotifications(birthdayEmployees);
```

## Frontend Integration

### Notification Component Structure
```javascript
// Get user notifications
fetch('/api/notifications?page=0&size=10', {
    headers: { 'Authorization': `Bearer ${token}` }
})

// Get notification summary
fetch('/api/notifications/summary', {
    headers: { 'Authorization': `Bearer ${token}` }
})

// Mark as read
fetch(`/api/notifications/${id}/read`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` }
})
```

### Real-time Updates (Future Enhancement)
WebSocket configuration is prepared for real-time notifications:
- Add `spring-boot-starter-websocket` dependency
- Uncomment WebSocketConfig
- Connect frontend to `/ws-notifications` endpoint

## Best Practices

### Performance
- Use pagination for notification lists
- Implement lazy loading for large notification sets
- Regular cleanup of old notifications

### User Experience
- Group similar notifications
- Provide clear action buttons when applicable
- Use appropriate priority levels
- Set expiration dates for time-sensitive notifications

### Security
- Always verify user permissions before creating notifications
- Sanitize notification content
- Log notification activities for audit purposes

## Error Handling

### Common Exceptions
- `NotFoundException` - User or notification not found
- `SecurityException` - Permission denied for notification access
- `ValidationException` - Invalid notification data

### Example Error Response
```json
{
    "error": "Notification not found",
    "message": "Notification with id 123 not found",
    "timestamp": "2024-01-15T10:30:00Z"
}
```

## Future Enhancements

### Planned Features
- [ ] Email notification integration
- [ ] SMS notification support
- [ ] Push notification support
- [ ] Real-time WebSocket notifications
- [ ] Notification templates
- [ ] Notification preferences per user
- [ ] Notification analytics and reporting
- [ ] Notification scheduling
- [ ] Rich text notifications with attachments

### Database Optimizations
- [ ] Add indexes for better query performance
- [ ] Implement notification archiving
- [ ] Add notification read receipts
- [ ] Implement notification categories

This notification system provides a solid foundation for user communication within the Employee Management System and can be extended based on specific business requirements.
