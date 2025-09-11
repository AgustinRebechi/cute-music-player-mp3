// src/utils/TimeFormatter.js
class TimeFormatter {
    /**
     * Formatea segundos a formato mm:ss
     * EXACTAMENTE como lo hacías antes, pero ahora reutilizable
     */
    static formatTime(seconds) {
        if (isNaN(seconds) || seconds == 0) return '0:00';
        
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
}

// Hacer disponible globalmente para usar en tu HTML
window.TimeFormatter = TimeFormatter;