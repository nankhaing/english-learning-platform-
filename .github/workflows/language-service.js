// 📁 public/language-service.js
import { auth, db, doc, updateDoc, getDoc } from './firebase-config.js';

// Supported Languages
export const languages = {
    en: {
        name: 'English',
        flag: '🇺🇸',
        direction: 'ltr'
    },
    my: {
        name: 'မြန်မာ',
        flag: '🇲🇲',
        direction: 'ltr'
    },
    zh: {
        name: '中文',
        flag: '🇨🇳',
        direction: 'ltr'
    },
    es: {
        name: 'Español',
        flag: '🇪🇸',
        direction: 'ltr'
    },
    fr: {
        name: 'Français',
        flag: '🇫🇷',
        direction: 'ltr'
    },
    ar: {
        name: 'العربية',
        flag: '🇸🇦',
        direction: 'rtl'
    },
    hi: {
        name: 'हिन्दी',
        flag: '🇮🇳',
        direction: 'ltr'
    },
    ja: {
        name: '日本語',
        flag: '🇯🇵',
        direction: 'ltr'
    }
};

// Translations Database
export const translations = {
    en: {        // Navigation
        'nav.home': 'Home',
        'nav.dashboard': 'Dashboard',
        'nav.profile': 'Profile',
        'nav.leaderboard': 'Leaderboard',
        'nav.certificates': 'Certificates',
        'nav.notifications': 'Notifications',
        'nav.analytics': 'Analytics',
        'nav.settings': 'Settings',
        'nav.logout': 'Logout',
        
        // Login
        'login.title': 'English Learning',
        'login.subtitle': 'Sign in to continue',
        'login.email': 'Email',
        'login.password': 'Password',
        'login.username': 'Username',
        'login.button': 'Login',
        'login.register': 'Create Account',
        'login.forgot': 'Forgot Password?',
        'login.developer': 'Developer Login?',
        
        // Dashboard
        'dashboard.welcome': 'Hello',
        'dashboard.ready': 'Ready to continue your journey?',
        'dashboard.streak': 'Day Streak',
        'dashboard.progress': 'Progress',
        'dashboard.lessons': 'Lessons',
        'dashboard.current': 'Current Lesson',
        'dashboard.completed': 'Completed',
        'dashboard.locked': 'Locked',
        
        // Profile
        'profile.title': 'My Profile',
        'profile.edit': 'Edit Profile',
        'profile.avatar': 'Choose Avatar',
        'profile.stats': 'Statistics',
        'profile.achievements': 'Achievements',
        'profile.history': 'Learning History',
        'profile.goals': 'Daily Goals',
        
        // Lessons
        'lesson.check': 'Check Answer',
        'lesson.continue': 'Continue',
        'lesson.correct': 'Correct! Great job!',
        'lesson.wrong': 'Wrong! Try again.',
        'lesson.complete': 'Lesson Complete!',
        'lesson.score': 'Score',
        'lesson.xp': 'XP Earned',
        'lesson.time': 'Time Spent',        
        // Common
        'common.save': 'Save',
        'common.cancel': 'Cancel',
        'common.delete': 'Delete',
        'common.edit': 'Edit',
        'common.view': 'View',
        'common.share': 'Share',
        'common.download': 'Download',
        'common.loading': 'Loading...',
        'common.error': 'Error',
        'common.success': 'Success',
        'common.back': 'Back',
        'common.exit': 'Exit',
        'common.search': 'Search',
        'common.filter': 'Filter',
        'common.sort': 'Sort',
        
        // Notifications
        'notif.title': 'Notifications',
        'notif.unread': 'Unread',
        'notif.read': 'Read',
        'notif.markRead': 'Mark as Read',
        'notif.delete': 'Delete',
        'notif.noNotif': 'No Notifications',
        
        // Settings
        'settings.title': 'Settings',
        'settings.language': 'Language',
        'settings.theme': 'Theme',
        'settings.notifications': 'Notifications',
        'settings.privacy': 'Privacy',
        'settings.account': 'Account',
        
        // Achievements
        'achieve.title': 'Achievements',
        'achieve.unlocked': 'Unlocked',
        'achieve.locked': 'Locked',
        'achieve.progress': 'Progress',
        
        // Certificate
        'cert.title': 'Certificate',
        'cert.completion': 'of Completion',
        'cert.name': 'Student Name',
        'cert.course': 'Course Name',
        'cert.date': 'Completed on',
        'cert.id': 'Certificate ID',
        
        // Leaderboard
        'leaderboard.title': 'Leaderboard',        'leaderboard.rank': 'Rank',
        'leaderboard.xp': 'XP',
        'leaderboard.lessons': 'Lessons',
        'leaderboard.streak': 'Streak',
        'leaderboard.yourRank': 'Your Position',
        
        // Analytics
        'analytics.title': 'Analytics',
        'analytics.users': 'Users',
        'analytics.completion': 'Completion',
        'analytics.performance': 'Performance',
        'analytics.trends': 'Trends',
        'analytics.export': 'Export Report',
        
        // Messages
        'msg.welcome': 'Welcome!',
        'msg.goodbye': 'Goodbye!',
        'msg.congrats': 'Congratulations!',
        'msg.keepGoing': 'Keep going!',
        'msg.tryAgain': 'Try again!',
        'msg.noInternet': 'No internet connection',
        'msg.saved': 'Saved successfully',
        'msg.deleted': 'Deleted successfully',
        'msg.error': 'Something went wrong'
    },
    
    my: {
        // Navigation
        'nav.home': 'ပင်မစာမျက်နှာ',
        'nav.dashboard': 'ဒေရှ်ဘုတ်',
        'nav.profile': 'ပရိုဖိုင်',
        'nav.leaderboard': 'အမှတ်စားရင်း',
        'nav.certificates': 'လက်မှတ်များ',
        'nav.notifications': 'အသိပေးချက်များ',
        'nav.analytics': 'အချက်အလက်များ',
        'nav.settings': 'ဆက်တင်များ',
        'nav.logout': 'ထွက်ခွာရန်',
        
        // Login
        'login.title': 'အင်္ဂလိပ်စာ သင်ယူခြင်း',
        'login.subtitle': 'ဆက်လက်ရန် ဝင်ရောက်ပါ',
        'login.email': 'အီးမေးလ်',
        'login.password': 'လျှို့ဝှက်နံပါတ်',
        'login.username': 'အသုံးပြုသူအမည်',
        'login.button': 'ဝင်ရောက်ရန်',
        'login.register': 'အကောင့်ဖွင့်ရန်',
        'login.forgot': 'လျှို့ဝှက်နံပါတ် မှတ်မိခြင်းမရှိပါ?',
        'login.developer': 'နည်းပညာအဖွဲ့ ဝင်ရောက်ရန်?',
        
        // Dashboard        'dashboard.welcome': 'မင်္ဂလာပါ',
        'dashboard.ready': 'လေ့လာမှုကို ဆက်လက်ရန် အဆင်သင့်လား?',
        'dashboard.streak': 'ရက်ဆက်တိုက်',
        'dashboard.progress': 'တိုးတက်မှု',
        'dashboard.lessons': 'သင်ခန်းစာများ',
        'dashboard.current': 'လက်ရှိသင်ခန်းစာ',
        'dashboard.completed': 'ပြီးဆုံး',
        'dashboard.locked': 'ပိတ်ဆို့ထား',
        
        // Profile
        'profile.title': 'ကျွန်ုပ်၏ ပရိုဖိုင်',
        'profile.edit': 'ပရိုဖိုင် ပြင်ဆင်ရန်',
        'profile.avatar': 'အိုင်ကွန် ရွေးချယ်ရန်',
        'profile.stats': 'စာရင်းအင်းများ',
        'profile.achievements': 'ရရှိမှုများ',
        'profile.history': 'လေ့လာမှုမှတ်တမ်း',
        'profile.goals': 'နေ့စဉ် ရည်မှန်းချက်များ',
        
        // Lessons
        'lesson.check': 'အဖြေစစ်ဆေးရန်',
        'lesson.continue': 'ဆက်လက်ရန်',
        'lesson.correct': 'မှန်ကန်ပါတယ်! ကောင်းစွာ လုပ်ဆောင်နိုင်ပါတယ်!',
        'lesson.wrong': 'မှားနေပါတယ်! ထပ်ကြိုးစားပါ။',
        'lesson.complete': 'သင်ခန်းစာ ပြီးဆုံးပါပြီ!',
        'lesson.score': 'ရမှတ်',
        'lesson.xp': 'ရရှိသော XP',
        'lesson.time': 'ကြာမြင့်ချိန်',
        
        // Common
        'common.save': 'သိမ်းဆည်းရန်',
        'common.cancel': 'ပယ်ဖျက်ရန်',
        'common.delete': 'ဖျက်ရန်',
        'common.edit': 'တည်းဖြတ်ရန်',
        'common.view': 'ကြည့်ရှုရန်',
        'common.share': 'မျှဝေရန်',
        'common.download': 'ဒေါင်းလုဒ်',
        'common.loading': 'လောဒ်တင်နေသည်...',
        'common.error': 'အမှား',
        'common.success': 'အောင်မြင်',
        'common.back': 'နောက်သို့',
        'common.exit': 'ထွက်ခွာရန်',
        'common.search': 'ရှာဖွေရန်',
        'common.filter': 'စစ်ထုတ်ရန်',
        'common.sort': 'အစီအစဉ်ချရန်',
        
        // Notifications
        'notif.title': 'အသိပေးချက်များ',
        'notif.unread': 'မဖတ်ရသေး',
        'notif.read': 'ဖတ်ပြီး',
        'notif.markRead': 'ဖတ်ပြီးအဖြစ် သတ်မှတ်',        'notif.delete': 'ဖျက်ရန်',
        'notif.noNotif': 'အသိပေးချက် မရှိပါ',
        
        // Settings
        'settings.title': 'ဆက်တင်များ',
        'settings.language': 'ဘာသာစကား',
        'settings.theme': 'အခြေပြုပုံစံ',
        'settings.notifications': 'အသိပေးချက်များ',
        'settings.privacy': 'ကိုယ်ရေးကိုယ်တာ',
        'settings.account': 'အကောင့်',
        
        // Achievements
        'achieve.title': 'ရရှိမှုများ',
        'achieve.unlocked': 'ရရှိပြီး',
        'achieve.locked': 'ပိတ်ဆို့ထား',
        'achieve.progress': 'တိုးတက်မှု',
        
        // Certificate
        'cert.title': 'လက်မှတ်',
        'cert.completion': 'ပြီးဆုံးကြောင်း',
        'cert.name': 'ကျောင်းသားအမည်',
        'cert.course': 'သင်တန်းအမည်',
        'cert.date': 'ပြီးဆုံးသောရက်',
        'cert.id': 'လက်မှတ်အိုင်ဒီ',
        
        // Leaderboard
        'leaderboard.title': 'အမှတ်စားရင်း',
        'leaderboard.rank': 'အဆင့်',
        'leaderboard.xp': 'XP',
        'leaderboard.lessons': 'သင်ခန်းစာ',
        'leaderboard.streak': 'ဆက်တိုက်',
        'leaderboard.yourRank': 'သင့်အဆင့်',
        
        // Analytics
        'analytics.title': 'အချက်အလက်များ',
        'analytics.users': 'အသုံးပြုသူ',
        'analytics.completion': 'ပြီးဆုံးမှု',
        'analytics.performance': 'လုပ်ဆောင်ချက်',
        'analytics.trends': 'လမ်းကြောင်း',
        'analytics.export': 'အစီရင်ခံစာ ထုတ်ယူ',
        
        // Messages
        'msg.welcome': 'ကြိုဆိုပါတယ်!',
        'msg.goodbye': 'နှုတ်ဆက်ပါတယ်!',
        'msg.congrats': 'ဂုဏ်ယူပါတယ်!',
        'msg.keepGoing': 'ဆက်လက်ကြိုးစားပါ!',
        'msg.tryAgain': 'ထပ်ကြိုးစားပါ!',
        'msg.noInternet': 'အင်တာနက်ချိတ်ဆက်မှု မရှိပါ',
        'msg.saved': 'အောင်မြင်စွာ သိမ်းဆည်းပြီး',
        'msg.deleted': 'အောင်မြင်စွာ ဖျက်ပြီး',        'msg.error': 'အမှားတစ်ခု ဖြစ်ပေါ်ခဲ့သည်'
    },
    
    zh: {
        // Navigation
        'nav.home': '首页',
        'nav.dashboard': '仪表板',
        'nav.profile': '个人资料',
        'nav.leaderboard': '排行榜',
        'nav.certificates': '证书',
        'nav.notifications': '通知',
        'nav.analytics': '分析',
        'nav.settings': '设置',
        'nav.logout': '登出',
        
        // Login
        'login.title': '英语学习',
        'login.subtitle': '登录以继续',
        'login.email': '电子邮件',
        'login.password': '密码',
        'login.username': '用户名',
        'login.button': '登录',
        'login.register': '创建账户',
        'login.forgot': '忘记密码？',
        'login.developer': '开发者登录？',
        
        // Dashboard
        'dashboard.welcome': '你好',
        'dashboard.ready': '准备好继续学习了吗？',
        'dashboard.streak': '连续天数',
        'dashboard.progress': '进度',
        'dashboard.lessons': '课程',
        'dashboard.current': '当前课程',
        'dashboard.completed': '已完成',
        'dashboard.locked': '已锁定',
        
        // Common
        'common.save': '保存',
        'common.cancel': '取消',
        'common.delete': '删除',
        'common.edit': '编辑',
        'common.view': '查看',
        'common.share': '分享',
        'common.download': '下载',
        'common.loading': '加载中...',
        'common.error': '错误',
        'common.success': '成功',
        'common.back': '返回',
        'common.exit': '退出'
    },    
    es: {
        // Navigation
        'nav.home': 'Inicio',
        'nav.dashboard': 'Panel',
        'nav.profile': 'Perfil',
        'nav.leaderboard': 'Clasificación',
        'nav.certificates': 'Certificados',
        'nav.notifications': 'Notificaciones',
        'nav.analytics': 'Análisis',
        'nav.settings': 'Configuración',
        'nav.logout': 'Cerrar sesión',
        
        // Login
        'login.title': 'Aprender Inglés',
        'login.subtitle': 'Inicia sesión para continuar',
        'login.email': 'Correo electrónico',
        'login.password': 'Contraseña',
        'login.username': 'Nombre de usuario',
        'login.button': 'Iniciar sesión',
        'login.register': 'Crear cuenta',
        'login.forgot': '¿Olvidaste tu contraseña?',
        'login.developer': '¿Inicio de desarrollador?',
        
        // Common
        'common.save': 'Guardar',
        'common.cancel': 'Cancelar',
        'common.delete': 'Eliminar',
        'common.edit': 'Editar',
        'common.view': 'Ver',
        'common.share': 'Compartir',
        'common.download': 'Descargar',
        'common.loading': 'Cargando...',
        'common.error': 'Error',
        'common.success': 'Éxito',
        'common.back': 'Atrás',
        'common.exit': 'Salir'
    }
};

// Current Language
let currentLanguage = 'en';

// Initialize Language
export async function initLanguage() {
    const user = auth.currentUser;
    let savedLanguage = localStorage.getItem('language');
    
    // Load from Firebase if user is logged in
    if (user) {        try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                savedLanguage = userData.language || savedLanguage;
            }
        } catch (error) {
            console.error("Error loading language preference:", error);
        }
    }
    
    // Auto-detect browser language if no saved language
    if (!savedLanguage) {
        const browserLang = navigator.language.slice(0, 2);
        savedLanguage = languages[browserLang] ? browserLang : 'en';
    }
    
    setLanguage(savedLanguage);
}

// Set Language
export function setLanguage(lang) {
    if (!languages[lang]) {
        lang = 'en';
    }
    
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    
    // Update HTML direction for RTL languages
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', languages[lang].direction);
    
    // Translate all elements
    translatePage();
    
    // Update language selector if exists
    updateLanguageSelector(lang);
}

// Save Language to Firebase
export async function saveLanguagePreference(lang) {
    const user = auth.currentUser;
    if (user) {
        try {
            await updateDoc(doc(db, "users", user.uid), {
                language: lang
            });
        } catch (error) {
            console.error("Error saving language preference:", error);        }
    }
}

// Translate Page
function translatePage() {
    // Translate elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = getTranslation(key);
        
        if (translation) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translation;
            } else {
                element.innerText = translation;
            }
        }
    });
    
    // Translate elements with data-i18n-placeholder attribute
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        const translation = getTranslation(key);
        if (translation) {
            element.placeholder = translation;
        }
    });
    
    // Translate elements with data-i18n-title attribute
    document.querySelectorAll('[data-i18n-title]').forEach(element => {
        const key = element.getAttribute('data-i18n-title');
        const translation = getTranslation(key);
        if (translation) {
            element.title = translation;
        }
    });
}

// Get Translation
export function getTranslation(key) {
    return translations[currentLanguage]?.[key] || translations['en']?.[key] || key;
}

// Get Current Language
export function getCurrentLanguage() {
    return currentLanguage;
}

// Get All Languagesexport function getAllLanguages() {
    return languages;
}

// Update Language Selector
function updateLanguageSelector(lang) {
    const selector = document.getElementById('languageSelector');
    if (selector) {
        selector.value = lang;
    }
}

// Create Language Selector Component
export function createLanguageSelector() {
    const selector = document.createElement('select');
    selector.id = 'languageSelector';
    selector.style.cssText = `
        padding: 8px 15px;
        border-radius: 20px;
        border: 2px solid var(--border);
        background: var(--surface);
        color: var(--text);
        font-size: 14px;
        cursor: pointer;
    `;
    
    Object.entries(languages).forEach(([code, data]) => {
        const option = document.createElement('option');
        option.value = code;
        option.innerText = `${data.flag} ${data.name}`;
        selector.appendChild(option);
    });
    
    selector.addEventListener('change', async (e) => {
        setLanguage(e.target.value);
        await saveLanguagePreference(e.target.value);
    });
    
    return selector;
}

// Export for global access
window.setLanguage = setLanguage;
window.getTranslation = getTranslation;
window.getCurrentLanguage = getCurrentLanguage;
window.getAllLanguages = getAllLanguages;
window.createLanguageSelector = createLanguageSelector;

