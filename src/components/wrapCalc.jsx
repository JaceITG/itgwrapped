import React from 'react';

const gradeThreshold = 4;    // Select scores with 1 Star grade or better

function newProfile(name) {
    let profile = {
        username: name,
        scores: [],             // TEMP: scores array to retain full list for debug until data interpretation is done real-time
        numScores: 0,
        daysPlayed: {},         // number of scores set on each unique day of year
        grades: {},             // GradeTier, Array score objects (for viewable list of songs quadded? alternatively only retain hardest quad)
        highestClear: null,     // Score obj of highest clear
        bestScore: {},          // Heuristically chosen "best score" based on EX score, grade, difficulty
    }

    return profile;
}
    
function processScore(profile, score) {
        // Inc numScores
        profile.numScores++;

        // Set default and inc scores set on this day
        profile.daysPlayed[ score["DateTime"] ] ??= 0;
        profile.daysPlayed[ score["DateTime"] ]++;

        // Save score in grades if above threshold
        const grade = parseInt(score["Grade"]["_text"].substring(4, 6));
        if ( grade <= gradeThreshold ) {
            profile.grades[grade] ??= [];
            profile.grades[grade].push( score );
        }
        return profile;
    };

function getBiggestDay(profile) {
        max_key = Object.keys(profile.daysPlayed).reduce((a, b) => obj[a] > obj[b] ? a : b);
        return max_key;
};

export {
    newProfile, processScore, getBiggestDay,
}