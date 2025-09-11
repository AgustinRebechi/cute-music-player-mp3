class UIController {
    constructor() {
        this.playButton = document.getElementById('playPause');
        this.progressBar = document.getElementById('progress');
        this.titleDisplay = document.getElementById('title');
        this.currentTimeDisplay = document.getElementById('current-time');
        this.durationDisplay = document.getElementById('duration');
        this.volumeProgress = document.getElementById('volumeProgress');
    }
    
    updatePlayButton(isPlaying) {
        if (isPlaying) {
            this.playButton.className = 'pause-btn';
        } else {
            this.playButton.className = 'play-btn';
        }
    }
    
    updateProgress(percentage) {
        this.progressBar.style.width = percentage + '%';
    }
    
    updateTime(currentTime, duration) {
        this.currentTimeDisplay.textContent = TimeFormatter.formatTime(currentTime);
        if (duration && !isNaN(duration)) {
            this.durationDisplay.textContent = TimeFormatter.formatTime(duration);
        }
    }
    
    updateTitle(title) {
        this.titleDisplay.textContent = title;
        this.setupTitleScrolling();
    }
    
    updateVolume(volumePercent) {
        this.volumeProgress.style.width = volumePercent + '%';
    }
// Actualizar UI del volumen
    updateVolumeUI() {
        const volumePercent = currentVolume * 100;
        this.volumeProgress.style.width = volumePercent + '%';
    }
    
    setupTitleScrolling() {
        const titleElement = this.titleDisplay;
        const containerElement = document.querySelector('.title-song');
        
        if (!titleElement || !containerElement) return;
        
        // Limpiar animación anterior
        titleElement.classList.remove('scrolling');
        titleElement.style.removeProperty('--scroll-distance');
        titleElement.style.removeProperty('--scroll-duration');
        
        // Esperar un frame para que se actualice el texto
        setTimeout(() => {
            // Crear un elemento temporal para medir el texto completo
            const tempElement = titleElement.cloneNode(true);
            tempElement.style.position = 'absolute';
            tempElement.style.visibility = 'hidden';
            tempElement.style.whiteSpace = 'nowrap';
            tempElement.style.width = 'auto';
            tempElement.style.transform = 'none';
            tempElement.style.fontSize = '24px';
            document.body.appendChild(tempElement);
            
            const titleWidth = tempElement.offsetWidth;
            document.body.removeChild(tempElement);
            
            // Ancho disponible real
            const availableWidth = 330;
            
            // Solo hacer scroll si REALMENTE no cabe
            if (titleWidth > availableWidth) {
                // TEXTO LARGO - necesita scroll
                const scrollDistance = -(titleWidth - 300);
                const baseDuration = 5;
                const extraDuration = (titleWidth - availableWidth) / 60;
                const totalDuration = baseDuration + extraDuration;
                
                titleElement.style.setProperty('--scroll-distance', scrollDistance + 'px');
                titleElement.style.setProperty('--scroll-duration', totalDuration + 's');
                
                titleElement.classList.add('scrolling');
            }
        }, 100);
    }
}

window.UIController = UIController;