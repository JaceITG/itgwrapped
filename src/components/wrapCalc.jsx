

class Profile {
    constructor(name) {
        self.username = name;
        self.scores = [];             // TEMP: scores array to retain full list for debug until data interpretation is done real-time
        self.numScores = 0;
        self.numUnqDaysPlayed = 0;
        self.numQuads = {};           // int quads, Array score objects (for viewable list of songs quadded? alternatively only retain hardest quad)
        self.highestClear = null;     // Score obj of highest clear
        self.bestScore = {};          // Heuristically chosen "best score" based on EX score, grade, difficulty
    };

    
    processScore(score) {
        
        return;
    }
}


export default Profile;