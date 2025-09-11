class FileService {
    static loadPlaylist(customOrder) {
        try {
            const fs = require('fs');
            const path = require('path');
            const songsDir = path.join(__dirname, 'songs');
            const files = fs.readdirSync(songsDir);
            
            const availableSongs = files
                .filter(file => file.endsWith('.mp3'))
                .map(file => ({
                    filename: file,
                    path: path.join(songsDir, file),
                    title: file.replace('.mp3', ''),
                    lyricsFile: path.join(songsDir, file.replace('.mp3', '.lrc'))
                }));

            const orderedPlaylist = [];
            
            // Ordenar según customOrder
            customOrder.forEach(customSong => {
                const found = availableSongs.find(song => song.filename === customSong);
                if (found) orderedPlaylist.push(found);
            });
            
            // Agregar canciones no listadas
            availableSongs.forEach(song => {
                if (!customOrder.includes(song.filename)) {
                    orderedPlaylist.push(song);
                }
            });
            
            return orderedPlaylist;
        } catch (error) {
            console.error('Error loading playlist:', error);
            return [];
        }
    }
}
window.FileService = FileService;