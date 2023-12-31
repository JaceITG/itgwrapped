import React from 'react';
import './xmlParser.css';
import stats from '../assets/Stats.xml';
import xmlJs from 'xml-js';
import JSONPretty from 'react-json-pretty';
import { newProfile, processScore, getBiggestDay } from './wrapCalc.jsx';

class XmlParser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            profile: {},

            metrics: {},
        }

        this.readXML(props.stats);
    }

    async parseStats(obj, year=2023){
        let metrics = {
            numQuads: 0,
            discoPop: 0,
        }

        // Collect profile username
        let profile = newProfile( obj["Stats"]["GeneralData"]["DisplayName"]["_text"] );

        // Get score data and filter to year
        let scores = obj["Stats"]["SongScores"]["Song"];

        // Filter through difficulties of each song, selecting only scores from correct year
        scores.map((song) => {
            let songName = song["_attributes"]["Dir"];

            let songScores = [];

            // Pack Song Steps field into array in case it is an object (songs with 1 difficulty)
            let diffArray = song["Steps"];
            if (Array.isArray( diffArray )){
                diffArray = diffArray;
            }else{
                diffArray = [ diffArray ];
            }

            // Add this year's scores from valid diffs to songScores
            for ( const diffIndex in diffArray ){
                let difficulty = diffArray[diffIndex];

                // Ignore doubles
                if ( difficulty["_attributes"]["StepsType"] != "dance-single" ) continue;

                // Ignore charts last played before target year
                let lastPlayedYear = parseInt( difficulty["HighScoreList"]["LastPlayed"]["_text"].split('-')[0] );
                if ( lastPlayedYear < year ) continue;

                // Ignore charts with no High Scores
                if (difficulty["HighScoreList"]["HighScore"] === undefined ) continue;

                let diffName = difficulty["_attributes"]["Difficulty"];

                // Pack HighScores into array in case difficulty has only 1 score
                let highScores = difficulty["HighScoreList"]["HighScore"];
                if ( Array.isArray( highScores ) ){
                    highScores = highScores;
                }else{
                    highScores = [ highScores ];
                }
                
                for ( const scoreIndex in highScores ){
                    let score = highScores[scoreIndex];

                    // Check score date
                    let scoreYear = parseInt( score["DateTime"]["_text"].split('-')[0] );
                    if ( scoreYear != year ) continue;

                    // Preserve song name/diff for standalone score object
                    score.Song = { path: songName, difficulty: diffName }

                    // Metrics
                    
                    // Count number of plays on Disco Pop
                    // This counts non-stars too so I have to do it here lol
                    if (score["Song"]["path"].includes("Disco Pop")) {
                        metrics.discoPop++;
                    }

                    // Count number of quads
                    if (parseFloat(score["PercentDP"]["_text"]) >= 1.0) {
                        metrics.numQuads++;
                    }

                    songScores.push(score);
                    console.log(score);
                    profile = processScore(profile, score);
                }
            }
        });

        this.setState({ profile: profile, metrics: metrics });
    }

    async readXML(path) {
        await fetch(path)
            .then((response) => response.text())
            .then((xmlText) => {
                console.log(path);

                // FIXME: parse straight to JS object once we no longer
                //        need the JSON for debug/validation
                const jsonData = xmlJs.xml2json(xmlText, { compact: true, spaces: 4 });
                console.log("Done reading");
                this.setState({ data: jsonData })

                this.parseStats(JSON.parse(jsonData));
            })
            .catch((error) => {
                console.error('Error fetching XML data:', error);
            });

    }

    render() {
        const { data, profile, metrics } = this.state;
        //const biggestDay = Object.keys(profile.daysPlayed).reduce((a, b) => obj[a] > obj[b] ? a : b);
        return (
            
            <div>
                <div>Player: {profile.username}</div>
                <p>You played Disco Pop {metrics.discoPop} times!</p>
                <p>You got {metrics.numQuads} quads!</p>
                <div>NumScores: {profile.numScores}</div>
                <JSONPretty id="json-pretty" data={profile.grades}></JSONPretty>
                <div>Scores:</div>
                <JSONPretty id="json-pretty" data={profile.scores}></JSONPretty>
            </div>
        );
    }
}

/* Full JSON Stats.xml debug element

<JSONPretty id="json-pretty" data={data}></JSONPretty>

*/

export default XmlParser;