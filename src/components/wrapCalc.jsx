import React from 'react';

const gradeThreshold = 4;    // Select scores with 1 Star grade or better

function newProfile(name) {
    let profile = {
        username: name,
        numScores: 0,
        daysPlayed: {},         // Number of scores set on each unique day of year
        packPlays: {},          // Number of scores set by pack
        songPlays: {},          // Number of scores set by song
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

        //Separate path/song elems and remove last
        let songPath = score["Song"]["path"].split('/');
        songPath.pop();
        
        // Set default and inc scores for song
        let song = songPath.pop();
        profile.songPlays[ song ] ??= 0;
        profile.songPlays[ song ]++;
        
        // Set default and inc scores for pack
        let pack = songPath.pop();
        profile.packPlays[pack] ??= 0;
        profile.packPlays[pack]++;

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

function getMaxDict(dict) {
        if (dict === undefined){
            return null;
        }
        let max_key = Object.keys(dict).reduce((a, b) => dict[a] > dict[b] ? a : b);
        return max_key;
};

export {
    newProfile, processScore, getMaxDict,
}