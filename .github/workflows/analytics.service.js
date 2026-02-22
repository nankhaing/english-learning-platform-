// 📁 public/analytics-service.js
import { auth, db, doc, updateDoc, getDoc, collection, addDoc } from './firebase-config.js';

// Track Lesson Completion
export async function trackLessonCompletion(userId, lessonId, score, timeSpent) {
    try {
        const userRef = doc(db, "users", userId);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
            const userData = userDoc.data();
            
            // Update user stats
            const completedLessons = userData.completedLessons || [];
            const lessonHistory = userData.lessonHistory || [];
            
            lessonHistory.push({
                lessonId,
                score,
                timeSpent,
                timestamp: new Date().toISOString()
            });
            
            // Calculate new average score
            const totalScore = lessonHistory.reduce((sum, l) => sum + l.score, 0);
            const avgScore = Math.round(totalScore / lessonHistory.length);
            
            await updateDoc(userRef, {
                completedLessons: [...completedLessons, lessonId],
                lessonHistory,
                averageScore: avgScore,
                timeSpent: (userData.timeSpent || 0) + timeSpent,
                lastActive: new Date()
            });
            
            // Track in analytics collection
            await addDoc(collection(db, "analytics"), {
                type: 'lesson_completion',
                userId,
                lessonId,
                score,
                timeSpent,
                timestamp: new Date().toISOString()
            });
            
            return true;
        }
        return false;
    } catch (error) {
        console.error("Error tracking lesson completion:", error);        return false;
    }
}

// Track User Activity
export async function trackUserActivity(userId, activity) {
    try {
        await addDoc(collection(db, "analytics"), {
            type: 'user_activity',
            userId,
            activity,
            timestamp: new Date().toISOString()
        });
        return true;
    } catch (error) {
        console.error("Error tracking activity:", error);
        return false;
    }
}

// Track Login
export async function trackLogin(userId) {
    await trackUserActivity(userId, 'login');
    
    // Update streak
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
        const userData = userDoc.data();
        const lastActive = userData.lastActive?.toDate();
        const today = new Date();
        
        if (lastActive) {
            const daysDiff = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24));
            
            if (daysDiff === 1) {
                // Continue streak
                await updateDoc(userRef, {
                    streak: (userData.streak || 0) + 1
                });
            } else if (daysDiff > 1) {
                // Reset streak
                await updateDoc(userRef, {
                    streak: 1
                });
            }
        } else {
            // First login
            await updateDoc(userRef, {                streak: 1
            });
        }
        
        await updateDoc(userRef, {
            lastActive: today
        });
    }
}

// Generate Weekly Report
export async function generateWeeklyReport(userId) {
    try {
        const userRef = doc(db, "users", userId);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
            const userData = userDoc.data();
            const lessonHistory = userData.lessonHistory || [];
            
            // Filter last 7 days
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            
            const weeklyLessons = lessonHistory.filter(l => 
                new Date(l.timestamp) > weekAgo
            );
            
            const report = {
                userId,
                weekStart: weekAgo.toISOString(),
                weekEnd: new Date().toISOString(),
                lessonsCompleted: weeklyLessons.length,
                avgScore: weeklyLessons.length > 0 
                    ? Math.round(weeklyLessons.reduce((sum, l) => sum + l.score, 0) / weeklyLessons.length)
                    : 0,
                totalTime: weeklyLessons.reduce((sum, l) => sum + l.timeSpent, 0),
                streak: userData.streak || 0
            };
            
            return report;
        }
        return null;
    } catch (error) {
        console.error("Error generating weekly report:", error);
        return null;
    }
}

// Get User Insightsexport async function getUserInsights(userId) {
    try {
        const userRef = doc(db, "users", userId);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
            const userData = userDoc.data();
            const insights = [];
            
            // Streak insight
            if (userData.streak >= 7) {
                insights.push({
                    type: 'positive',
                    message: `🔥 Great! You're on a ${userData.streak}-day streak!`
                });
            } else if (userData.streak > 0) {
                insights.push({
                    type: 'warning',
                    message: `⚠️ Keep going! You have a ${userData.streak}-day streak. Don't break it!`
                });
            }
            
            // Score insight
            if (userData.averageScore >= 90) {
                insights.push({
                    type: 'positive',
                    message: `🎯 Excellent! Your average score is ${userData.averageScore}%!`
                });
            } else if (userData.averageScore < 70) {
                insights.push({
                    type: 'suggestion',
                    message: `💡 Try reviewing lessons to improve your ${userData.averageScore}% average score.`
                });
            }
            
            // Activity insight
            const lessonHistory = userData.lessonHistory || [];
            const recentLessons = lessonHistory.filter(l => {
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return new Date(l.timestamp) > weekAgo;
            });
            
            if (recentLessons.length >= 5) {
                insights.push({
                    type: 'positive',
                    message: `📚 Awesome! You completed ${recentLessons.length} lessons this week!`
                });
            } else {
                insights.push({                    type: 'suggestion',
                    message: `📖 Try completing more lessons this week. You've done ${recentLessons.length} so far.`
                });
            }
            
            return insights;
        }
        return [];
    } catch (error) {
        console.error("Error getting insights:", error);
        return [];
    }
}

