// 📁 public/notification-service.js
import { auth, db, doc, updateDoc, getDoc, collection, addDoc, query, where, getDocs, deleteDoc } from './firebase-config.js';

// Notification Types
export const notificationTypes = {
    ACHIEVEMENT: 'achievement',
    REMINDER: 'reminder',
    STREAK: 'streak',
    LESSON: 'lesson',
    UPDATE: 'update',
    GENERAL: 'general',
    WELCOME: 'welcome',
    LEVEL_UP: 'level_up',
    CERTIFICATE: 'certificate',
    FRIEND: 'friend'
};

// Notification Icons
export const notificationIcons = {
    [notificationTypes.ACHIEVEMENT]: '🏆',
    [notificationTypes.REMINDER]: '⏰',
    [notificationTypes.STREAK]: '🔥',
    [notificationTypes.LESSON]: '📚',
    [notificationTypes.UPDATE]: '📢',
    [notificationTypes.GENERAL]: '🔔',
    [notificationTypes.WELCOME]: '👋',
    [notificationTypes.LEVEL_UP]: '⬆️',
    [notificationTypes.CERTIFICATE]: '📜',
    [notificationTypes.FRIEND]: '👥'
};

// Send Notification to User
export async function sendNotification(userId, notification) {
    try {
        const userRef = doc(db, "users", userId);
        const userDoc = await getDoc(userRef);
        
        if (!userDoc.exists()) {
            console.error("User not found:", userId);
            return false;
        }
        
        const userData = userDoc.data();
        const notifications = userData.notifications || [];
        
        // Create notification object
        const newNotification = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            title: notification.title,
            message: notification.message,            type: notification.type || notificationTypes.GENERAL,
            icon: notification.icon || notificationIcons[notification.type] || '🔔',
            read: false,
            timestamp: new Date().toISOString(),
            action: notification.action || null,
            data: notification.data || {}
        };
        
        // Add new notification to beginning of array
        notifications.unshift(newNotification);
        
        // Keep only last 100 notifications (prevent database bloat)
        if (notifications.length > 100) {
            notifications.splice(100);
        }
        
        // Update user document
        await updateDoc(userRef, {
            notifications: notifications,
            lastNotificationAt: new Date().toISOString()
        });
        
        // Send push notification if enabled
        if (userData.notificationPreferences?.push !== false) {
            await sendPushNotification(notification);
        }
        
        // Send email if enabled (requires Cloud Functions)
        if (userData.notificationPreferences?.email !== false && userData.email) {
            await queueEmailNotification(userData.email, notification);
        }
        
        console.log('✅ Notification sent:', newNotification.id);
        return true;
        
    } catch (error) {
        console.error("❌ Error sending notification:", error);
        return false;
    }
}

// Send Push Notification (Browser)
export async function sendPushNotification(notification) {
    if (!('Notification' in window)) {
        console.log('Push notifications not supported');
        return false;
    }
    
    if (Notification.permission === 'granted') {
        try {            const icon = notification.icon || notificationIcons[notification.type] || '🔔';
            
            const options = {
                body: notification.message,
                icon: '/assets/icons/icon-192.png',
                badge: '/assets/icons/icon-72.png',
                vibrate: [200, 100, 200],
                tag: notification.id || 'englearn-notification',
                requireInteraction: false,
                silent: false,
                data: {
                    url: notification.action || '/notifications.html',
                    timestamp: Date.now()
                },
                actions: [
                    {
                        action: 'open',
                        title: 'Open',
                        icon: '/assets/icons/icon-72.png'
                    },
                    {
                        action: 'close',
                        title: 'Close'
                    }
                ]
            };
            
            const notificationInstance = new Notification(notification.title, options);
            
            // Handle notification click
            notificationInstance.onclick = function(event) {
                event.preventDefault();
                window.focus();
                if (notification.action) {
                    window.location.href = notification.action;
                } else {
                    window.location.href = '/notifications.html';
                }
                notificationInstance.close();
            };
            
            // Auto-close after 5 seconds
            setTimeout(() => notificationInstance.close(), 5000);
            
            console.log('🔔 Push notification sent');
            return true;
            
        } catch (error) {
            console.error('❌ Push notification failed:', error);
            return false;        }
    } else if (Notification.permission !== 'denied') {
        // Request permission
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            return sendPushNotification(notification);
        }
    }
    
    return false;
}

// Queue Email Notification (For Cloud Functions)
export async function queueEmailNotification(email, notification) {
    try {
        // This would be handled by Firebase Cloud Functions in production
        // For now, we'll log it and store in Firestore
        await addDoc(collection(db, "emailQueue"), {
            email: email,
            subject: notification.title,
            body: notification.message,
            type: notification.type,
            status: 'pending',
            createdAt: new Date().toISOString(),
            userId: auth.currentUser?.uid || null
        });
        
        console.log('📧 Email queued:', email);
        return true;
    } catch (error) {
        console.error('❌ Email queue failed:', error);
        return false;
    }
}

// Send Welcome Notification
export async function sendWelcomeNotification(userId, username) {
    return sendNotification(userId, {
        title: '👋 Welcome to English Learning!',
        message: `Hi ${username}! Start your learning journey today. Complete your first lesson to get started!`,
        type: notificationTypes.WELCOME,
        action: '/lesson.html'
    });
}

// Send Achievement Notification
export async function sendAchievementNotification(userId, username, achievement) {
    return sendNotification(userId, {
        title: '🏆 Achievement Unlocked!',
        message: `Congratulations ${username}! You earned the "${achievement.name}" badge!`,        type: notificationTypes.ACHIEVEMENT,
        icon: '🏆',
        action: '/profile.html',
        data: {
            achievementId: achievement.id,
            achievementName: achievement.name
        }
    });
}

// Send Daily Reminder
export async function sendDailyReminder(userId, username) {
    return sendNotification(userId, {
        title: '⏰ Time to Learn!',
        message: `Hi ${username}! Keep your streak going by completing a lesson today. You're doing great!`,
        type: notificationTypes.REMINDER,
        icon: '⏰',
        action: '/dashboard.html'
    });
}

// Send Streak Warning
export async function sendStreakWarning(userId, username, streak, hoursLeft) {
    return sendNotification(userId, {
        title: '🔥 Streak Alert!',
        message: `Hi ${username}! Your ${streak}-day streak will expire in ${hoursLeft} hours. Complete a lesson to keep it!`,
        type: notificationTypes.STREAK,
        icon: '🔥',
        action: '/dashboard.html',
        data: {
            streak: streak,
            hoursLeft: hoursLeft
        }
    });
}

// Send Lesson Complete Notification
export async function sendLessonCompleteNotification(userId, username, lessonName, score) {
    return sendNotification(userId, {
        title: '📚 Lesson Complete!',
        message: `Great job ${username}! You scored ${score}% in ${lessonName}. Keep up the excellent work!`,
        type: notificationTypes.LESSON,
        icon: '📚',
        action: '/certificate.html',
        data: {
            lessonName: lessonName,
            score: score
        }
    });
}
// Send Level Up Notification
export async function sendLevelUpNotification(userId, username, newLevel) {
    return sendNotification(userId, {
        title: '⬆️ Level Up!',
        message: `Congratulations ${username}! You've reached Level ${newLevel}! Keep learning to unlock more features!`,
        type: notificationTypes.LEVEL_UP,
        icon: '⬆️',
        action: '/profile.html',
        data: {
            level: newLevel
        }
    });
}

// Send Certificate Notification
export async function sendCertificateNotification(userId, username, certificateName) {
    return sendNotification(userId, {
        title: '📜 Certificate Earned!',
        message: `Amazing ${username}! You've earned a certificate for "${certificateName}". Download it from your profile!`,
        type: notificationTypes.CERTIFICATE,
        icon: '📜',
        action: '/certificate.html',
        data: {
            certificateName: certificateName
        }
    });
}

// Send Update Notification
export async function sendUpdateNotification(userId, updateTitle, updateMessage) {
    return sendNotification(userId, {
        title: '📢 ' + updateTitle,
        message: updateMessage,
        type: notificationTypes.UPDATE,
        icon: '📢',
        action: '/dashboard.html'
    });
}

// Get User Notifications
export async function getUserNotifications(userId, limit = 50) {
    try {
        const userRef = doc(db, "users", userId);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
            const notifications = userDoc.data().notifications || [];
            return notifications.slice(0, limit);
        }        
        return [];
    } catch (error) {
        console.error("Error getting notifications:", error);
        return [];
    }
}

// Get Unread Count
export async function getUnreadNotificationCount(userId) {
    try {
        const notifications = await getUserNotifications(userId);
        return notifications.filter(n => !n.read).length;
    } catch (error) {
        console.error("Error getting unread count:", error);
        return 0;
    }
}

// Mark Notification as Read
export async function markNotificationAsRead(userId, notificationId) {
    try {
        const userRef = doc(db, "users", userId);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
            const notifications = userDoc.data().notifications || [];
            const updated = notifications.map(n => {
                if (n.id === notificationId) {
                    return { ...n, read: true };
                }
                return n;
            });
            
            await updateDoc(userRef, { notifications: updated });
            console.log('✅ Notification marked as read');
            return true;
        }
        
        return false;
    } catch (error) {
        console.error("Error marking notification as read:", error);
        return false;
    }
}

// Mark All Notifications as Read
export async function markAllNotificationsAsRead(userId) {
    try {
        const userRef = doc(db, "users", userId);        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
            const notifications = userDoc.data().notifications || [];
            const updated = notifications.map(n => ({ ...n, read: true }));
            
            await updateDoc(userRef, { notifications: updated });
            console.log('✅ All notifications marked as read');
            return true;
        }
        
        return false;
    } catch (error) {
        console.error("Error marking all notifications as read:", error);
        return false;
    }
}

// Delete Notification
export async function deleteNotification(userId, notificationId) {
    try {
        const userRef = doc(db, "users", userId);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
            const notifications = userDoc.data().notifications || [];
            const updated = notifications.filter(n => n.id !== notificationId);
            
            await updateDoc(userRef, { notifications: updated });
            console.log('✅ Notification deleted');
            return true;
        }
        
        return false;
    } catch (error) {
        console.error("Error deleting notification:", error);
        return false;
    }
}

// Delete All Notifications
export async function deleteAllNotifications(userId) {
    try {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, { notifications: [] });
        console.log('✅ All notifications deleted');
        return true;
    } catch (error) {
        console.error("Error deleting all notifications:", error);
        return false;    }
}

// Request Notification Permission
export async function requestNotificationPermission() {
    if (!('Notification' in window)) {
        console.log('Notifications not supported');
        return false;
    }
    
    if (Notification.permission === 'granted') {
        return true;
    }
    
    if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
    }
    
    return false;
}

// Check Notification Permission
export function checkNotificationPermission() {
    if (!('Notification' in window)) {
        return 'not-supported';
    }
    return Notification.permission;
}

// Schedule Daily Reminder (Call from Cloud Functions)
export async function scheduleDailyReminders() {
    // This would be called from Firebase Cloud Functions on a schedule
    // For now, this is a placeholder for client-side scheduling
    
    const user = auth.currentUser;
    if (!user) return;
    
    try {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
            const userData = userDoc.data();
            const lastActive = userData.lastActive?.toDate();
            const now = new Date();
            
            // Check if user hasn't been active today
            if (lastActive) {
                const hoursSinceActive = (now - lastActive) / (1000 * 60 * 60);                
                if (hoursSinceActive > 24 && userData.notificationPreferences?.reminder !== false) {
                    await sendDailyReminder(user.uid, userData.username || 'Student');
                }
            }
        }
    } catch (error) {
        console.error("Error scheduling reminder:", error);
    }
}

// Initialize Notification Service
export async function initNotificationService() {
    const user = auth.currentUser;
    
    if (!user) {
        console.log('No user logged in, skipping notification init');
        return;
    }
    
    // Request permission
    await requestNotificationPermission();
    
    // Check for pending notifications
    const unreadCount = await getUnreadNotificationCount(user.uid);
    
    if (unreadCount > 0) {
        console.log(`🔔 You have ${unreadCount} unread notifications`);
    }
    
    // Setup periodic check for new notifications (every 5 minutes)
    setInterval(async () => {
        const newUnreadCount = await getUnreadNotificationCount(user.uid);
        if (newUnreadCount > unreadCount) {
            console.log('🔔 New notifications received!');
            // You could trigger a UI update here
        }
    }, 5 * 60 * 1000);
    
    console.log('✅ Notification Service Initialized');
}

// Export for global access
window.sendNotification = sendNotification;
window.sendPushNotification = sendPushNotification;
window.sendAchievementNotification = sendAchievementNotification;
window.sendDailyReminder = sendDailyReminder;
window.sendStreakWarning = sendStreakWarning;
window.sendLessonCompleteNotification = sendLessonCompleteNotification;
window.getUserNotifications = getUserNotifications;window.getUnreadNotificationCount = getUnreadNotificationCount;
window.markNotificationAsRead = markNotificationAsRead;
window.markAllNotificationsAsRead = markAllNotificationsAsRead;
window.deleteNotification = deleteNotification;
window.requestNotificationPermission = requestNotificationPermission;
window.checkNotificationPermission = checkNotificationPermission;
window.initNotificationService = initNotificationService;
window.notificationTypes = notificationTypes;
window.notificationIcons = notificationIcons;

