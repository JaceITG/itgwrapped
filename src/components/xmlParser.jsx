import React from 'react';
import quadIcon from '../assets/4stars.svg';
import triIcon from '../assets/3stars.svg';
import dubIcon from '../assets/2stars.svg';
import starIcon from '../assets/1stars.svg';

import arrowIcon from '../assets/itgarrow.svg';
import mineIcon from '../assets/mine.svg';
import percentIcon from '../assets/percent.svg';
import discoIcon from '../assets/7discopop.svg';
import calendarIcon from '../assets/calendar.svg';
import folderIcon from '../assets/folder.svg';
import noteIcon from '../assets/musicnote.svg';
import padIcon from '../assets/pad.svg';
import quadStarIcon from '../assets/quadstar.svg';
import youTried from '../assets/youtried.png';

import LoadingArrow from '../assets/arrow.svg?react';

import xmlJs from 'xml-js';
import html2canvas from 'html2canvas';
import Popup from 'reactjs-popup';

import { newProfile, processScore, getMaxDict, getSongName } from './wrapCalc.jsx';
import Heatmap from './Heatmap';
import Shareable from './Shareable.jsx';

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

        this.isYear = props.isYear;
        this.subtitle = props.subtitle;

        this.readXML(props.stats, props.start, props.end);
    }

    async handleShare() {
        html2canvas(document.getElementsByClassName('stats-modal')[0]).then( (canvas) => {
            let img = canvas.toDataURL('Shareable/png');
            let node = document.createElement('img');
            node.src = img;
            node.id = 'Shareable-img';
            document.getElementById('share-modal').appendChild(node);
            console.log("Picture appended");
        });
    }

    // Select scores set between a given start, end Date (inclusive)
    async parseStats(obj, start, end) {

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

                // Ignore charts last played before target date range
                let lastPlayedDate = new Date(difficulty["HighScoreList"]["LastPlayed"]["_text"] + "00:00:00");
                if (lastPlayedDate < start) {
                    continue;
                }

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
                    let scoreDate = new Date(score["DateTime"]["_text"]);
                    if ( !(scoreDate >= start && scoreDate <= end) ) {
                        continue;
                    };

                    // Preserve song name/diff for standalone score object
                    score.Song = { path: songName, difficulty: diffName }

                    profile = processScore(profile, score);
                }
            }
        });

        this.setState({ profile: profile });
    }

    async readXML(path, start, end) {
        await fetch(path)
            .then((response) => response.text())
            .then((xmlText) => {
                const dataObj = xmlJs.xml2js(xmlText, { compact: true, spaces: 4 });
                console.log("Done reading");

                this.parseStats(dataObj, start, end);
            })
            .catch((error) => {
                console.error('Error fetching XML data:', error);
            });

    }

    render() {
        const { profile, image } = this.state;

        if (profile === undefined) {
            return(
                <div className="loading">
                    <p className = "loading-text">Processing scores...</p>
                    <div className = "loading-arrow-container">
                        <LoadingArrow className = "loading-arrow-1" />
                        <LoadingArrow className = "loading-arrow-2" />
                    </div>
                </div>
            );
        } else if (profile.numScores <= 0) {
            return (
                <div className="loading">
                    <p className="loading-text">Uh oh! No scores within time range in this file!</p>
                    <p className="loading-subtext">Check that you have selected the correct Stats.xml file.</p>
                    <p className="loading-subtext">You may need to merge stats files if you play only on the FA+ gamemode.</p>
                </div>
            )
        }

        /*  Stat Features TODO:
        *   -FEC, etc count
        *   -Score and/or date distribution graph
        */

        console.log(profile.daysPlayed);

        let biggestDay = getMaxDict(profile.daysPlayed);
        let mostPlayedPack = getMaxDict(profile.packPlays);
        let mostPlayedSong = getMaxDict(profile.songPlays);
        return (
            <div className="stats-wrapper">
                <div className="stats-title">
                    <p className="stats-title-a">Hey {profile.username}!</p>
                    <p className="stats-title-b">In {this.subtitle}, you...</p>
                </div>
                <ul className="stats-list metrics">
                    <li>...set <p className="value">{profile.numScores.toLocaleString()}</p> total scores!
                        <img className="stat-icon" src={padIcon} />
                    </li>
                    { !this.isYear && Object.keys(profile.daysPlayed).length > 0 &&
                        <li className='has-confetti'>
                            <div>...played on <p className='value'>{Object.keys(profile.daysPlayed).length} out of 29</p> days!
                                {Object.keys(profile.daysPlayed).length >= 29 &&
                                    <p>🎉 You played ITG every day this February! 🎉</p>
                                }
                                {Object.keys(profile.daysPlayed).length <= 10 ?
                                    <img className='stat-icon' src={youTried}/>
                                    :
                                    <img className='stat-icon' src={percentIcon}/>
                                }
                            </div>
                        </li>
                    }
                    <li>...stepped on <p className="value">{profile.notesHit.toLocaleString()}</p> notes
                        <img className="stat-icon" src={arrowIcon} />
                    </li>
                    <li>...but also on <p className="value">{profile.minesHit.toLocaleString()}</p> mines...
                        <img className="stat-icon" src={mineIcon} />
                    </li>
                    
                    { profile.grades && ("1" in profile.grades) &&
                        <li>...got {profile.grades["1"].length || 0} quads!
                            <a>
                                {
                                    profile.grades["1"].map( (score, index) => 
                                    index < 5 &&
                                    <div>
                                        <div className='song-name'><img className="stars" src={quadIcon} />{getSongName(score)}</div> 
                                    </div>
                                )}

                                { profile.grades["1"].length >= 5 &&
                                    <p>...and more!</p>
                                }
                            </a>
                            <img className="stat-icon" src={quadStarIcon} />
                        </li>
                    }

                    <li>...played Disco Pop <p className="value">{profile.discoPop}</p> times!
                        <img className='stat-icon' src={discoIcon} />
                    </li>
                    <li>Biggest Day: <p className="value">{dateFormat.format(Date.parse(biggestDay))}</p> with {profile.daysPlayed[biggestDay]} scores set!
                        <img className="stat-icon" src={calendarIcon} />
                    </li>
                    <li>Favorite Pack: <p className="value">{mostPlayedPack}</p> with {profile.packPlays[mostPlayedPack]} scores set!
                        <img className="stat-icon" src={folderIcon} />
                    </li>
                    <li>Favorite Song: <p className="value">{mostPlayedSong}</p> with {profile.songPlays[mostPlayedSong]} scores set!
                        <img className="stat-icon" src={noteIcon} />
                    </li>
                </ul>
				<p className = "heatmap-header-title">Total Stars</p>
                <div className = "stats-stars">
                    <p className="value">
                        <img className="stars" src={quadIcon} /> 
                         {("1" in profile.grades) && profile.grades["1"].length || 0}
                    </p>
                    <p className="value">
                        <img className="stars" src={triIcon} /> 
                         {("2" in profile.grades) && profile.grades["2"].length || 0}
                    </p>
                    <p className="value">
                        <img className="stars" src={dubIcon} /> 
                        {("3" in profile.grades) && profile.grades["3"].length || 0}
                    </p>
                    <p className="value">
                        <img className="stars" src={starIcon} /> 
                         {("4" in profile.grades) && profile.grades["4"].length || 0}
                    </p>
                </div>
                { this.isYear &&
                    <Heatmap dates = {profile.daysPlayed} maxDay = {profile.daysPlayed[biggestDay]} />
                }
                <Popup 
                    trigger={<div className="info-box"><div className='info-box-text'>📷 Get Shareable Image</div></div>}
                    onOpen={() => this.handleShare()}
                    modal nested>
                    {
                        close => (
                            <div id='share-modal' onClick=
                                {() => close()}>
                            </div>
                        )
                    }
                </Popup>
                <div className="page-end" />

                <Shareable profile={profile} mostPlayedPack={mostPlayedPack}
                    mostPlayedSong={mostPlayedSong} biggestDay={biggestDay} isYear={this.isYear}/>
            </div>
        );
    }
}

export default XmlParser;