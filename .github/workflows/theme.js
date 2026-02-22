
// 📁 public/theme.js
import { auth, db, doc, updateDoc, getDoc } from './firebase-config.js';

// Theme Configuration
const themeConfig = {
    light: {
        name: 'Light',
        icon: '☀️',
        primary: '#764ba2',
        secondary: '#667eea',
        background: '#f4f7f6',
        surface: '#ffffff',
        text: '#2c3e50',
        textSecondary: '#777777'
    },
    dark: {
        name: 'Dark',
        icon: '🌙',
        primary: '#9b6dd6',
        secondary: '#8a9df5',
        background: '#1a1a2e',
        surface: '#16213e',
        text: '#eaeaea',
        textSecondary: '#b0b0b0'
    }
};

// Initialize Theme
export async function initTheme() {
    const user = auth.currentUser;
    let savedTheme = localStorage.getItem('theme');
    
    // Load from Firebase if user is logged in
    if (user) {
        try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                savedTheme = userData.theme || savedTheme;
            }
        } catch (error) {
            console.error("Error loading theme preference:", error);
        }
    }
    
    // Auto-detect system preference if no saved theme
    if (!savedTheme) {
        savedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
        applyTheme(savedTheme);
    setupThemeToggle();
    setupSystemThemeListener();
}

// Apply Theme
export function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateThemeToggleIcon(theme);
    
    // Update CSS variables
    const config = themeConfig[theme];
    const root = document.documentElement;
    
    root.style.setProperty('--primary', config.primary);
    root.style.setProperty('--secondary', config.secondary);
    root.style.setProperty('--background', config.background);
    root.style.setProperty('--surface', config.surface);
    root.style.setProperty('--text', config.text);
    root.style.setProperty('--text-secondary', config.textSecondary);
}

// Save Theme to Firebase
export async function saveThemePreference(theme) {
    const user = auth.currentUser;
    if (user) {
        try {
            await updateDoc(doc(db, "users", user.uid), {
                theme: theme
            });
        } catch (error) {
            console.error("Error saving theme preference:", error);
        }
    }
}

// Setup Theme Toggle
function setupThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    if (toggle) {
        toggle.addEventListener('click', toggleTheme);
    }
}

// Toggle Theme
export async function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        // Add transition animation
    document.documentElement.style.transition = 'all 0.3s ease';
    
    applyTheme(newTheme);
    await saveThemePreference(newTheme);
    
    // Remove transition after animation
    setTimeout(() => {
        document.documentElement.style.transition = '';
    }, 300);
}

// Update Toggle Icon
function updateThemeToggleIcon(theme) {
    const toggle = document.getElementById('themeToggle');
    if (toggle) {
        toggle.innerHTML = themeConfig[theme].icon;
        toggle.setAttribute('title', `Switch to ${themeConfig[theme === 'dark' ? 'light' : 'dark'].name} Mode`);
    }
}

// Listen for System Theme Changes
function setupSystemThemeListener() {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
        const savedTheme = localStorage.getItem('theme');
        if (!savedTheme) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });
}

// Get Current Theme
export function getCurrentTheme() {
    return document.documentElement.getAttribute('data-theme') || 'light';
}

// Export for global access
window.toggleTheme = toggleTheme;
window.getCurrentTheme = getCurrentTheme;
