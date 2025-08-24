package com.ems.ems_backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.ems.ems_backend.model.Employee;
import com.ems.ems_backend.model.Notification;
import com.ems.ems_backend.model.User;
import com.ems.ems_backend.repository.UserRepository;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class NotificationEventService {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;

    /**
     * Send welcome notification to new employee
     */
    @Async
    public void sendWelcomeNotification(User newUser) {
        try {
            String title = "Welcome to the Employee Management System!";
            String message = String.format(
                "Hello %s, welcome to our organization! Your account has been successfully created. " +
                "Please update your profile information and familiarize yourself with the system.",
                newUser.getUsername()
            );

            notificationService.createSystemNotification(
                newUser.getId(),
                title,
                message,
                Notification.NotificationType.SUCCESS,
                Notification.NotificationPriority.NORMAL
            );

            log.info("Welcome notification sent to new user: {}", newUser.getUsername());
        } catch (Exception e) {
            log.error("Failed to send welcome notification to user: {}", newUser.getUsername(), e);
        }
    }

    /**
     * Notify user about profile update
     */
    @Async
    public void sendProfileUpdateNotification(User user, String updatedBy) {
        try {
            String title = "Profile Updated";
            String message = String.format(
                "Your profile information has been updated by %s. " +
                "Please review your profile details to ensure accuracy.",
                updatedBy
            );

            notificationService.createSystemNotification(
                user.getId(),
                title,
                message,
                Notification.NotificationType.INFO,
                Notification.NotificationPriority.NORMAL
            );

            log.info("Profile update notification sent to user: {}", user.getUsername());
        } catch (Exception e) {
            log.error("Failed to send profile update notification to user: {}", user.getUsername(), e);
        }
    }

    /**
     * Notify user about role change
     */
    @Async
    public void sendRoleChangeNotification(User user, User.Role oldRole, User.Role newRole, String changedBy) {
        try {
            String title = "Role Updated";
            String message = String.format(
                "Your role has been changed from %s to %s by %s. " +
                "Your new permissions and access levels are now active.",
                oldRole.name(), newRole.name(), changedBy
            );

            notificationService.createSystemNotification(
                user.getId(),
                title,
                message,
                Notification.NotificationType.WARNING,
                Notification.NotificationPriority.HIGH
            );

            log.info("Role change notification sent to user: {} ({}->{})",
                    user.getUsername(), oldRole, newRole);
        } catch (Exception e) {
            log.error("Failed to send role change notification to user: {}", user.getUsername(), e);
        }
    }

    /**
     * Notify managers about new employee in their department
     */
    @Async
    public void notifyManagersAboutNewEmployee(Employee newEmployee) {
        try {
            // Find all managers and department heads
            List<User> managers = userRepository.findByRole(User.Role.MANAGER);
            List<User> departmentHeads = userRepository.findByRole(User.Role.DEPARTMENT_HEAD);
            List<User> hrUsers = userRepository.findByRole(User.Role.HR);

            String title = "New Employee Added";
            String message = String.format(
                "A new employee %s %s (ID: %s) has been added to the %s department.",
                newEmployee.getFirstName(),
                newEmployee.getLastName(),
                newEmployee.getEmployeeId(),
                newEmployee.getDepartmentEntity() != null ? 
                    newEmployee.getDepartmentEntity().getName() : 
                    (newEmployee.getDepartment() != null ? newEmployee.getDepartment() : "N/A")
            );

            // Notify managers
            managers.forEach(manager -> {
                notificationService.createSystemNotification(
                    manager.getId(),
                    title,
                    message,
                    Notification.NotificationType.INFO,
                    Notification.NotificationPriority.NORMAL
                );
            });

            // Notify department heads
            departmentHeads.forEach(head -> {
                notificationService.createSystemNotification(
                    head.getId(),
                    title,
                    message,
                    Notification.NotificationType.INFO,
                    Notification.NotificationPriority.NORMAL
                );
            });

            // Notify HR
            hrUsers.forEach(hr -> {
                notificationService.createSystemNotification(
                    hr.getId(),
                    title,
                    message,
                    Notification.NotificationType.INFO,
                    Notification.NotificationPriority.NORMAL
                );
            });

            log.info("New employee notifications sent for: {} {}", 
                    newEmployee.getFirstName(), newEmployee.getLastName());
        } catch (Exception e) {
            log.error("Failed to send new employee notifications", e);
        }
    }

    /**
     * Send birthday reminders
     */
    @Async
    public void sendBirthdayNotifications(List<Employee> birthdayEmployees) {
        try {
            List<User> hrUsers = userRepository.findByRole(User.Role.HR);
            List<User> managers = userRepository.findByRole(User.Role.MANAGER);

            for (Employee employee : birthdayEmployees) {
                String title = "Birthday Reminder";
                String message = String.format(
                    "Today is %s %s's birthday! Don't forget to wish them well.",
                    employee.getFirstName(), employee.getLastName()
                );

                // Notify HR
                hrUsers.forEach(hr -> {
                    notificationService.createSystemNotification(
                        hr.getId(),
                        title,
                        message,
                        Notification.NotificationType.BIRTHDAY,
                        Notification.NotificationPriority.LOW
                    );
                });

                // Notify managers
                managers.forEach(manager -> {
                    notificationService.createSystemNotification(
                        manager.getId(),
                        title,
                        message,
                        Notification.NotificationType.BIRTHDAY,
                        Notification.NotificationPriority.LOW
                    );
                });

                // Notify the employee themselves
                if (employee.getUser() != null) {
                    notificationService.createSystemNotification(
                        employee.getUser().getId(),
                        "Happy Birthday!",
                        "Wishing you a wonderful birthday and a great year ahead!",
                        Notification.NotificationType.BIRTHDAY,
                        Notification.NotificationPriority.NORMAL
                    );
                }
            }

            log.info("Birthday notifications sent for {} employees", birthdayEmployees.size());
        } catch (Exception e) {
            log.error("Failed to send birthday notifications", e);
        }
    }

    /**
     * Send work anniversary notifications
     */
    @Async
    public void sendAnniversaryNotifications(List<Employee> anniversaryEmployees) {
        try {
            List<User> hrUsers = userRepository.findByRole(User.Role.HR);
            List<User> managers = userRepository.findByRole(User.Role.MANAGER);

            for (Employee employee : anniversaryEmployees) {
                String title = "Work Anniversary";
                String message = String.format(
                    "Today marks %s %s's work anniversary with the company! Let's celebrate their contribution.",
                    employee.getFirstName(), employee.getLastName()
                );

                // Notify HR
                hrUsers.forEach(hr -> {
                    notificationService.createSystemNotification(
                        hr.getId(),
                        title,
                        message,
                        Notification.NotificationType.ANNIVERSARY,
                        Notification.NotificationPriority.LOW
                    );
                });

                // Notify managers
                managers.forEach(manager -> {
                    notificationService.createSystemNotification(
                        manager.getId(),
                        title,
                        message,
                        Notification.NotificationType.ANNIVERSARY,
                        Notification.NotificationPriority.LOW
                    );
                });

                // Notify the employee themselves
                if (employee.getUser() != null) {
                    notificationService.createSystemNotification(
                        employee.getUser().getId(),
                        "Happy Work Anniversary!",
                        "Thank you for your dedication and hard work. Here's to many more successful years together!",
                        Notification.NotificationType.ANNIVERSARY,
                        Notification.NotificationPriority.NORMAL
                    );
                }
            }

            log.info("Anniversary notifications sent for {} employees", anniversaryEmployees.size());
        } catch (Exception e) {
            log.error("Failed to send anniversary notifications", e);
        }
    }

    /**
     * Send system maintenance notification to all users
     */
    @Async
    public void sendMaintenanceNotification(String title, String message, LocalDateTime scheduledTime) {
        try {
            List<User> allUsers = userRepository.findAllExcludingSuperAdmin();

            String fullMessage = String.format(
                "%s\n\nScheduled Time: %s\nPlease save your work and log out before the maintenance window.",
                message, scheduledTime.toString()
            );

            allUsers.forEach(user -> {
                notificationService.createSystemNotification(
                    user.getId(),
                    title,
                    fullMessage,
                    Notification.NotificationType.SYSTEM,
                    Notification.NotificationPriority.HIGH
                );
            });

            log.info("Maintenance notification sent to {} users", allUsers.size());
        } catch (Exception e) {
            log.error("Failed to send maintenance notifications", e);
        }
    }

    /**
     * Send urgent system alert to all admins
     */
    @Async
    public void sendUrgentAdminAlert(String title, String message) {
        try {
            List<User> admins = userRepository.findByRole(User.Role.ADMIN);

            admins.forEach(admin -> {
                notificationService.createSystemNotification(
                    admin.getId(),
                    title,
                    message,
                    Notification.NotificationType.ERROR,
                    Notification.NotificationPriority.URGENT
                );
            });

            log.info("Urgent alert sent to {} admins", admins.size());
        } catch (Exception e) {
            log.error("Failed to send urgent admin alerts", e);
        }
    }

    /**
     * Send password change notification
     */
    @Async
    public void sendPasswordChangeNotification(User user) {
        try {
            String title = "Password Changed";
            String message = "Your password has been successfully changed. " +
                           "If you did not make this change, please contact your administrator immediately.";

            notificationService.createSystemNotification(
                user.getId(),
                title,
                message,
                Notification.NotificationType.WARNING,
                Notification.NotificationPriority.HIGH
            );

            log.info("Password change notification sent to user: {}", user.getUsername());
        } catch (Exception e) {
            log.error("Failed to send password change notification to user: {}", user.getUsername(), e);
        }
    }

    /**
     * Send account lock notification
     */
    @Async
    public void sendAccountLockNotification(User user, String reason) {
        try {
            String title = "Account Locked";
            String message = String.format(
                "Your account has been locked due to: %s. " +
                "Please contact your administrator to unlock your account.",
                reason
            );

            notificationService.createSystemNotification(
                user.getId(),
                title,
                message,
                Notification.NotificationType.ERROR,
                Notification.NotificationPriority.URGENT
            );

            log.info("Account lock notification sent to user: {}", user.getUsername());
        } catch (Exception e) {
            log.error("Failed to send account lock notification to user: {}", user.getUsername(), e);
        }
    }
}
