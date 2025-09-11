class TextUtils {
    static formatTextForBubble(text, maxLength = 25) {
        if (text.length <= maxLength) return text;
        
        const words = text.split(' ');
        let lines = [];
        let currentLine = '';
        
        words.forEach(word => {
            if ((currentLine + word).length <= maxLength) {
                currentLine += (currentLine ? ' ' : '') + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        });
        
        if (currentLine) lines.push(currentLine);
        return lines.join('\n');
    }
    
    static typeText(text, element, speed = 50) {
        return new Promise(resolve => {
            element.textContent = '';
            let index = 0;
            const interval = setInterval(() => {
                if (index < text.length) {
                    element.textContent += text[index];
                    index++;
                } else {
                    clearInterval(interval);
                    resolve();
                }
            }, speed);
        });
    }
}
window.TextUtils = TextUtils;