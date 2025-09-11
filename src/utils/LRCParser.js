/**
 * Parser para archivos LRC (lyrics)
 * Tu función parseLRC() exacta, pero organizada
 */
class LRCParser {
    /**
     * Parsea contenido LRC a array de objetos con time y text
     * EXACTAMENTE tu función original
     */
    static parse(lrcContent) {
        const lyrics = [];
        const lines = lrcContent.split('\n');
        
        for (const line of lines) {
            const match = line.match(/\[(\d{2}):(\d{2})\.(\d{2})\](.*)/);
            if (match) {
                const minutes = parseInt(match[1]);
                const seconds = parseInt(match[2]);
                const centiseconds = parseInt(match[3]);
                const text = match[4].trim();
                
                const timeInSeconds = minutes * 60 + seconds + (centiseconds / 100);
                lyrics.push({ time: timeInSeconds, text: text });
            }
        }
        
        return lyrics.sort((a, b) => a.time - b.time);
    }
}

// Disponible globalmente
window.LRCParser = LRCParser;