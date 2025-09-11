class CommentService {
    constructor(comments) {
        this.comments = comments;
        this.lastCommentTime = -1;
    }
    
    checkForComments(currentTime, songTitle) {
        const songData = this.comments[songTitle];
        if (!songData) return null;
        
        for (const time in songData) {
            const targetTime = parseFloat(time);
            if (Math.abs(currentTime - targetTime) < 0.2 && this.lastCommentTime !== targetTime) {
                this.lastCommentTime = targetTime;
                return songData[time];
            }
        }
        return null;
    }
    
    resetComments() {
        this.lastCommentTime = -1;
    }
}
window.CommentService = CommentService;