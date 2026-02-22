// 📁 public/audio-service.js
import { auth, db, doc, updateDoc, getDoc } from './firebase-config.js';

let bgMusic = null;
let musicEnabled = true;
let sfxEnabled = true;
let currentTrack = 'calm';

export async function initAudio() {
    const user = auth.currentUser;
    
    // Load user preferences
    if (user) {
        try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                const s = userDoc.data().audioSettings || {};
                musicEnabled = s.musicEnabled ?? true;
                sfxEnabled = s.sfxEnabled ?? true;
            }
        } catch (error) {
            console.warn('⚠️ Could not load audio settings');
        }
    }
    
    // Initialize background music (with error handling)
    try {
        bgMusic = new Audio('assets/audio/music/calm.mp3');
        bgMusic.loop = true;
        bgMusic.volume = 0.3;
        
        // Auto-play after first user interaction
        document.addEventListener('click', () => {
            if (musicEnabled && bgMusic) {
                bgMusic.play().catch(e => {
                    console.log('🎵 Music autoplay blocked (normal)');
                });
            }
        }, { once: true });
        
        console.log('✅ Audio initialized');
    } catch (error) {
        console.warn('⚠️ Audio files missing - running in silent mode');
    }
}

export function playSFX(name) {
    if (!sfxEnabled) return;
    
    try {        const sfx = new Audio(`assets/audio/sfx/${name}.mp3`);
        sfx.volume = 0.5;
        sfx.play().catch(e => {
            // Silently fail if file missing
        });
    } catch (error) {
        // Do nothing - app continues working
    }
}

export function loadMusicTrack(trackName) {
    if (!bgMusic) return;
    
    const tracks = {
        calm: 'assets/audio/music/calm.mp3',
        upbeat: 'assets/audio/music/upbeat.mp3',
        classical: 'assets/audio/music/classical.mp3',
        nature: 'assets/audio/music/nature.mp3',
        lofi: 'assets/audio/music/lofi.mp3'
    };
    
    if (tracks[trackName]) {
        bgMusic.src = tracks[trackName];
        currentTrack = trackName;
        if (musicEnabled) {
            bgMusic.play().catch(()=>{});
        }
    }
}

export function toggleMusic() {
    musicEnabled = !musicEnabled;
    if (bgMusic) {
        musicEnabled ? bgMusic.play().catch(()=>{}) : bgMusic.pause();
    }
}

export function toggleSFX() {
    sfxEnabled = !sfxEnabled;
}

export function setMusicVolume(vol) {
    if (bgMusic) bgMusic.volume = vol;
}

export function setSFXVolume(vol) {
    // SFX volume set per playback
}

export function getCurrentTrack() {    return currentTrack;
}

export function getAudioConfig() {
    return { musicEnabled, sfxEnabled, currentTrack };
}

// Export for global access
window.playSFX = playSFX;
window.toggleMusic = toggleMusic;
window.toggleSFX = toggleSFX;
window.loadMusicTrack = loadMusicTrack;
window.getCurrentTrack = getCurrentTrack;
window.getAudioConfig = getAudioConfig;