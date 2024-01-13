import React from 'react';
import './xmlParser.css';
import stats from '../assets/Stats.xml';
import xmlJs from 'xml-js';
import JSONPretty from 'react-json-pretty';
import { newProfile, processScore, getMaxDict } from './wrapCalc.jsx';

class XmlParser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            profile: undefined,
        }

        this.readXML(props.stats);
    }

    async parseStats(obj, year = 2023) {

        // Collect profile username
        let profile = newProfile(obj["Stats"]["GeneralData"]["DisplayName"]["_text"]);

        // Get score data and filter to year
        let scores = obj["Stats"]["SongScores"]["Song"];

        // Filter through difficulties of each song, selecting only scores from correct year
        scores.map((song) => {
            let songName = song["_attributes"]["Dir"];

            // Pack Song Steps field into array in case it is an object (songs with 1 difficulty)
            let diffArray = song["Steps"];
            if (Array.isArray(diffArray)) {
                diffArray = diffArray;
            } else {
                diffArray = [diffArray];
            }

            // Add this year's scores from valid diffs to songScores
            for (const diffIndex in diffArray) {
                let difficulty = diffArray[diffIndex];

                // Ignore doubles
                if (difficulty["_attributes"]["StepsType"] != "dance-single") continue;

                // Ignore charts last played before target year
                let lastPlayedYear = parseInt(difficulty["HighScoreList"]["LastPlayed"]["_text"].split('-')[0]);
                if (lastPlayedYear < year) continue;

                // Ignore charts with no High Scores
                if (difficulty["HighScoreList"]["HighScore"] === undefined) continue;

                let diffName = difficulty["_attributes"]["Difficulty"];

                // Pack HighScores into array in case difficulty has only 1 score
                let highScores = difficulty["HighScoreList"]["HighScore"];
                if (Array.isArray(highScores)) {
                    highScores = highScores;
                } else {
                    highScores = [highScores];
                }

                for (const scoreIndex in highScores) {
                    let score = highScores[scoreIndex];

                    // Check score date
                    let scoreYear = parseInt(score["DateTime"]["_text"].split('-')[0]);
                    if (scoreYear != year) continue;

                    // Preserve song name/diff for standalone score object
                    score.Song = { path: songName, difficulty: diffName }

                    profile = processScore(profile, score);
                }
            }
        });

        this.setState({ profile: profile });
    }

    async readXML(path) {
        await fetch(path)
            .then((response) => response.text())
            .then((xmlText) => {
                const dataObj = xmlJs.xml2js(xmlText, { compact: true, spaces: 4 });
                console.log("Done reading");

                this.parseStats(dataObj);
            })
            .catch((error) => {
                console.error('Error fetching XML data:', error);
            });

    }

    render() {
        const { profile } = this.state;

        if (profile === undefined) {
            return(
                <div className="stats-wrapper">
                    Processing scores...
                </div>
            );
        }

        /*  Stat Features TODO:
        *   -number of mines hit
        *   -total notes hit
        *   -FEC, etc count
        *   -Score and/or date distribution graph
        */

        let biggestDay = getMaxDict(profile.daysPlayed);
        let mostPlayedPack = getMaxDict(profile.packPlays);
        let mostPlayedSong = getMaxDict(profile.songPlays);
        return (
            <div className="stats-wrapper">
                <div className="stats-title">
                    <p className="stats-title-a">Hello, {profile.username}</p>
                    <p className="stats-title-b">In 2023, you...</p>
                </div>
                <div className="metrics">
                    <p className="metrics-left metrics-item-r">...set {profile.numScores} total scores!</p>
                    <p className="metrics-right">...got {profile.grades && ("1" in profile.grades) && profile.grades["1"].length || 0} quads!</p>
                    <p className="metrics-left">...played Disco Pop {profile.discoPop} times!</p>
                    {profile.numQuads > 0 && <p>You got {profile.numQuads} quad{profile.numQuads == 1 ? "" : "s"}!</p>}
                </div>
                <ul class="stats-list">
                    <li>Biggest Day: {biggestDay} with {profile.daysPlayed[biggestDay]} scores set!</li>
                    <li>Favorite Pack: {mostPlayedPack} with {profile.packPlays[mostPlayedPack]} scores set!</li>
                    <li>Favorite Song: {mostPlayedSong} with {profile.songPlays[mostPlayedSong]} scores set!</li>
                </ul>
                <div>
                    <p>★★★★: {("1" in profile.grades) && profile.grades["1"].length || 0}</p>
                    <p>★★★: {("2" in profile.grades) && profile.grades["2"].length || 0}</p>
                    <p>★★: {("3" in profile.grades) && profile.grades["3"].length || 0}</p>
                    <p>★: {("4" in profile.grades) && profile.grades["4"].length || 0}</p>
                </div>
                <JSONPretty id="json-pretty" data={profile.grades}></JSONPretty>
            </div>
        );
    }
}

/* Full JSON Stats.xml debug element

<JSONPretty id="json-pretty" data={data}></JSONPretty>

*/

export default XmlParser;