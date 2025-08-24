# Notification API Testing with Postman

## Prerequisites

1. **Start the Backend Server**
   - Make sure your Spring Boot application is running on `http://localhost:8080`
   - The server should be accessible and the database should be connected

2. **Authentication Setup**
   - You'll need a valid JWT token for authentication
   - First, login through your existing auth endpoint to get a token

## Step 1: Get Authentication Token

### Login Request
```
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
    "username": "admin",
    "password": "your_password"
}
```

**Expected Response:**
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "type": "Bearer",
    "username": "admin",
    "role": "ADMIN"
}
```

**Copy the token value for use in subsequent requests**

---

## Step 2: Setup Postman Environment

1. Create a new Environment in Postman called "EMS Notifications"
2. Add these variables:
   - `baseUrl`: `http://localhost:8080`
   - `token`: `[paste your JWT token here]`
   - `userId`: `1` (or your user ID)

---

## Step 3: Test Notification APIs

### 🔍 **Test 1: Get User Notifications Summary**

```
GET {{baseUrl}}/api/notifications/summary
Authorization: Bearer {{token}}
```

**Expected Response:**
```json
{
    "totalNotifications": 0,
    "unreadCount": 0,
    "highPriorityUnreadCount": 0,
    "urgentPriorityUnreadCount": 0,
    "recentNotifications": []
}
```

---

### 📝 **Test 2: Create a System Notification (Admin Only)**

```
POST {{baseUrl}}/api/notifications/system
Authorization: Bearer {{token}}
Content-Type: application/x-www-form-urlencoded

recipientId=1
title=System Test Notification
message=This is a test notification from Postman
type=SYSTEM
priority=NORMAL
```

**Expected Response:**
```
System notification created successfully
```

---

### 📝 **Test 3: Create a Detailed Notification (Admin/HR Only)**

```
POST {{baseUrl}}/api/notifications
Authorization: Bearer {{token}}
Content-Type: application/json

{
    "recipientId": 1,
    "title": "Important Update",
    "message": "Please review the new policy document attached. This is urgent and requires your immediate attention.",
    "type": "INFO",
    "priority": "HIGH",
    "actionUrl": "/policies/new-policy",
    "actionLabel": "View Policy"
}
```

**Expected Response:**
```json
{
    "id": 1,
    "title": "Important Update",
    "message": "Please review the new policy document attached...",
    "type": "INFO",
    "priority": "HIGH",
    "isRead": false,
    "createdAt": "2025-01-15T10:30:00",
    "actionUrl": "/policies/new-policy",
    "actionLabel": "View Policy",
    "recipientName": "admin",
    "senderName": "System",
    "isExpired": false
}
```

---

### 📋 **Test 4: Get All User Notifications**

```
GET {{baseUrl}}/api/notifications?page=0&size=10
Authorization: Bearer {{token}}
```

**Expected Response:**
```json
{
    "content": [
        {
            "id": 1,
            "title": "Important Update",
            "message": "Please review the new policy document...",
            "type": "INFO",
            "priority": "HIGH",
            "isRead": false,
            "createdAt": "2025-01-15T10:30:00"
        }
    ],
    "totalElements": 1,
    "totalPages": 1,
    "size": 10,
    "number": 0
}
```

---

### 🔔 **Test 5: Get Unread Notifications**

```
GET {{baseUrl}}/api/notifications/unread
Authorization: Bearer {{token}}
```

**Expected Response:**
```json
[
    {
        "id": 1,
        "title": "Important Update",
        "message": "Please review the new policy document...",
        "type": "INFO",
        "priority": "HIGH",
        "isRead": false,
        "createdAt": "2025-01-15T10:30:00"
    }
]
```

---

### ✅ **Test 6: Mark Notification as Read**

```
PUT {{baseUrl}}/api/notifications/1/read
Authorization: Bearer {{token}}
```

**Expected Response:** `200 OK` (empty body)

---

### 📋 **Test 7: Get Specific Notification**

```
GET {{baseUrl}}/api/notifications/1
Authorization: Bearer {{token}}
```

**Expected Response:**
```json
{
    "id": 1,
    "title": "Important Update",
    "message": "Please review the new policy document...",
    "type": "INFO",
    "priority": "HIGH",
    "isRead": true,
    "readAt": "2025-01-15T10:35:00",
    "createdAt": "2025-01-15T10:30:00"
}
```

---

### 📊 **Test 8: Get Filtered Notifications**

```
GET {{baseUrl}}/api/notifications/filter?isRead=false&type=INFO&priority=HIGH&page=0&size=5
Authorization: Bearer {{token}}
```

**Expected Response:** Paginated list of notifications matching the filters

---

### 📢 **Test 9: Send Bulk Notifications (Admin/HR Only)**

```
POST {{baseUrl}}/api/notifications/bulk
Authorization: Bearer {{token}}
Content-Type: application/x-www-form-urlencoded

recipientIds=1,2,3
title=Company Meeting
message=Monthly all-hands meeting tomorrow at 10 AM in the main conference room
type=MEETING_REMINDER
priority=NORMAL
```

**Expected Response:**
```
Bulk notifications sent to 3 users
```

---

### 🎯 **Test 10: Send Role-Based Notification (Admin Only)**

```
POST {{baseUrl}}/api/notifications/broadcast/role/MANAGER
Authorization: Bearer {{token}}
Content-Type: application/x-www-form-urlencoded

title=Manager Meeting
message=Monthly manager meeting tomorrow at 2 PM
type=MEETING_REMINDER
priority=HIGH
```

**Expected Response:**
```
Notification sent to all users with role: MANAGER
```

---

### ✅ **Test 11: Mark All Notifications as Read**

```
PUT {{baseUrl}}/api/notifications/read-all
Authorization: Bearer {{token}}
```

**Expected Response:** `200 OK` (empty body)

---

### 🗑️ **Test 12: Delete Notification**

```
DELETE {{baseUrl}}/api/notifications/1
Authorization: Bearer {{token}}
```

**Expected Response:** `200 OK` (empty body)

---

## Step 4: Test Error Scenarios

### ❌ **Test 13: Unauthorized Access (No Token)**

```
GET {{baseUrl}}/api/notifications
# Don't include Authorization header
```

**Expected Response:** `401 Unauthorized`

---

### ❌ **Test 14: Access Another User's Notification**

```
GET {{baseUrl}}/api/notifications/999
Authorization: Bearer {{token}}
```

**Expected Response:** `404 Not Found` or `403 Forbidden`

---

### ❌ **Test 15: Invalid Notification Data**

```
POST {{baseUrl}}/api/notifications
Authorization: Bearer {{token}}
Content-Type: application/json

{
    "recipientId": null,
    "title": "",
    "message": ""
}
```

**Expected Response:** `400 Bad Request` with validation errors

---

## Step 5: Test Notification Types and Priorities

### 📝 **Test Different Notification Types**

Create notifications with different types:

```
POST {{baseUrl}}/api/notifications/system
Authorization: Bearer {{token}}
Content-Type: application/x-www-form-urlencoded

recipientId=1
title=Birthday Reminder
message=Today is John Doe's birthday!
type=BIRTHDAY
priority=LOW
```

```
POST {{baseUrl}}/api/notifications/system
Authorization: Bearer {{token}}
Content-Type: application/x-www-form-urlencoded

recipientId=1
title=Urgent Security Alert
message=Suspicious login activity detected on your account
type=ERROR
priority=URGENT
```

---

## Step 6: Verify Data in Database

After running tests, you can verify the data was created correctly:

### Check Notifications Table
```sql
SELECT * FROM notifications ORDER BY created_at DESC;
```

### Check Notification Counts
```sql
SELECT 
    type, 
    priority, 
    COUNT(*) as count,
    SUM(CASE WHEN is_read = false THEN 1 ELSE 0 END) as unread_count
FROM notifications 
GROUP BY type, priority;
```

---

## Testing Tips

1. **Test in Order**: Follow the test sequence to build up data
2. **Check Response Times**: APIs should respond within 200-500ms
3. **Verify Permissions**: Test with different user roles (Admin, HR, Employee)
4. **Test Pagination**: Use different page sizes and numbers
5. **Test Edge Cases**: Empty lists, invalid IDs, malformed requests

## Common Issues & Solutions

### Issue: "No notifications found"
- **Solution**: Make sure you've created some notifications first

### Issue: "Unauthorized" errors
- **Solution**: Check your JWT token is valid and not expired

### Issue: "Method not allowed"
- **Solution**: Verify you're using the correct HTTP method (GET, POST, PUT, DELETE)

### Issue: Database connection errors
- **Solution**: Ensure your database is running and connection properties are correct

---

## Postman Collection Export

You can create a Postman collection with all these requests and export it for team use. Make sure to:

1. Use environment variables for baseUrl and token
2. Include example responses
3. Add test scripts to validate responses
4. Set up pre-request scripts for authentication if needed

This comprehensive testing suite will help you verify that your notification system is working correctly!
