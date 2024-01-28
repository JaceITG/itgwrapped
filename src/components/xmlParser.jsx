import React from 'react';
import quadIcon from '../assets/quad.svg';
import triIcon from '../assets/tri.svg';
import dubIcon from '../assets/dub.svg';
import starIcon from '../assets/star.svg';
import xmlJs from 'xml-js';
import JSONPretty from 'react-json-pretty';
import { newProfile, processScore, getMaxDict, getSongName } from './wrapCalc.jsx';
import Heatmap from './Heatmap';

const dateFormat = new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
});

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
        *   -FEC, etc count
        *   -Score and/or date distribution graph
        */

        let biggestDay = getMaxDict(profile.daysPlayed);
        let mostPlayedPack = getMaxDict(profile.packPlays);
        let mostPlayedSong = getMaxDict(profile.songPlays);
        return (
            <div className="stats-wrapper">
                <div className="stats-title">
                    <p className="stats-title-a">Hey {profile.username}!</p>
                    <p className="stats-title-b">In 2023...</p>
                </div>
                <div className="stats-list metrics">
                    <div className = "stats-list-item">You set <p className="value">{profile.numScores.toLocaleString()}</p> total scores!</div>
                    <div className = "stats-list-item">You stepped on <p className="value">{profile.notesHit.toLocaleString()}</p> notes!</div>
                    <div className = "stats-list-item">...but you also hit <p className="value">{profile.minesHit.toLocaleString()}</p> mines...</div>
                    
                    { profile.grades && ("1" in profile.grades) &&
                        <div className = "stats-list-item">You got {profile.grades["1"].length || 0} quads!
                            <a>
                                {
                                    profile.grades["1"].map( (score, index) => 
                                    index < 5 &&
                                    <div>
                                        <img className="stars" src={quadIcon} />
                                        <b>  {getSongName(score)}</b> 
                                    </div>
                                )}

                                { profile.grades["1"].length >= 5 &&
                                    <p>...and more!</p>
                                }
                            </a>
                        </div>
                    }

                    <div className = "stats-list-item">You played Disco Pop <p className="value">{profile.discoPop}</p> times!</div>
                    <div className = "stats-list-item">Your biggest day was <p className="value">{dateFormat.format(Date.parse(biggestDay))}</p> where you set {profile.daysPlayed[biggestDay]} scores!</div>
                    <div className = "stats-list-item">Your favorite pack was <p className="value">{mostPlayedPack}</p> with {profile.packPlays[mostPlayedPack]} scores set!</div>
                    <div className = "stats-list-item">And your favorite song was <p className="value">{mostPlayedSong}</p> which you played {profile.songPlays[mostPlayedSong]} times!</div>
                    <div className = "stats-list-grades">
                        <div className="value">
                            <img className="stats-list-stars" src={quadIcon} /> 
                            <p>{("1" in profile.grades) && profile.grades["1"].length || 0}</p>
                        </div>
                        <div className="value">
                            <img className="stats-list-stars" src={triIcon} /> 
                            <p>{("2" in profile.grades) && profile.grades["2"].length || 0}</p>
                        </div>
                        <div className="value">
                            <img className="stats-list-stars" src={dubIcon} /> 
                            <p>{("3" in profile.grades) && profile.grades["3"].length || 0}</p>
                        </div>
                        <div className="value">
                            <img className="stats-list-stars" src={starIcon} /> 
                            <p>{("4" in profile.grades) && profile.grades["4"].length || 0}</p>
                        </div>
                    </div>
                </div>
                <Heatmap dates = {profile.daysPlayed} maxDay = {profile.daysPlayed[biggestDay]} />
                {/*<JSONPretty id="json-pretty" data={profile.grades}></JSONPretty>*/}
            </div>
        );
    }
}

/* Full JSON Stats.xml debug element

<JSONPretty id="json-pretty" data={data}></JSONPretty>

*/

export default XmlParser;