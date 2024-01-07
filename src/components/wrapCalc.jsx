import React from 'react';

const gradeThreshold = 4;    // Select scores with 1 Star grade or better

function newProfile(name) {
    let profile = {
        username: name,
        scores: [],             // TEMP: scores array to retain full list for debug until data interpretation is done real-time
        numScores: 0,
        daysPlayed: {},         // number of scores set on each unique day of year
        grades: {},             // GradeTier, Array score objects (for viewable list of songs quadded? alternatively only retain hardest quad)
        bestScore: {},          // Heuristically chosen "best score" based on EX score, grade, difficulty
        numQuads: 0,
        discoPop: 0,            // Times the Disco Pop chart was played
    }

    return profile;
}
    
function processScore(profile, score) {
        // Inc numScores
        profile.numScores++;

        // Set default and inc scores set on this day
        let date = score["DateTime"]["_text"]
        date = date.split(" ")[0]
        profile.daysPlayed[ date ] ??= 0;
        profile.daysPlayed[ date ]++;

        // Metrics
        // As long as metric calc are outside of the Grade Threshold guard
        // They can be calculated here :>

        // Count number of plays on Disco Pop
        if (score["Song"]["path"].includes("Disco Pop")) {
            profile.discoPop++;
        }

        // Count number of quads
        if (parseFloat(score["PercentDP"]["_text"]) >= 1.0) {
            profile.numQuads++;
        }

        // Save score in grades if above threshold
        const grade = parseInt(score["Grade"]["_text"].substring(4, 6));
        if ( grade <= gradeThreshold ) {
            profile.grades[grade] ??= [];
            profile.grades[grade].push( score );
        }
        return profile;
    };

function getBiggestDay(profile) {
        if (profile.daysPlayed === undefined){
            return null;
        }
        let max_key = Object.keys(profile.daysPlayed).reduce((a, b) => profile[a] > profile[b] ? a : b);
        return max_key;
};

export {
    newProfile, processScore, getBiggestDay,
}