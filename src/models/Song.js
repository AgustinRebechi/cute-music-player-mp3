class Song {
    constructor(filename, path, title, lyricsFile) {
        this.filename = filename;
        this.path = path;
        this.title = title || filename.replace('.mp3', '');
        this.lyricsFile = lyricsFile;
        this.duration = 0;
    }
    
    hasLyrics() {
        const fs = require('fs');
        return fs.existsSync(this.lyricsFile);
    }
}
window.Song = Song;