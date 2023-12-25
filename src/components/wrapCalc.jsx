

function newProfile(name) {
    var profile = { 
        username: name,
        scores: [],             // TEMP: scores array to retain full list for debug until data interpretation is done real-time
        numScores: 0,
        numUnqDaysPlayed: 0,
        numQuads: {},           // int quads, Array score objects (for viewable list of songs quadded? alternatively only retain hardest quad)
        highestClear: null,     // Score obj of highest clear
        bestScore: {},          // Heuristically chosen "best score" based on EX score, grade, difficulty
    };

    return profile;
}

export default newProfile;