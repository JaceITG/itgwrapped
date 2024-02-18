import Popup from 'reactjs-popup';
import React from 'react';

import quadIcon from '../assets/4stars.png';
import triIcon from '../assets/3stars.png';
import dubIcon from '../assets/2stars.png';
import starIcon from '../assets/1stars.png';
import { getSongName } from './wrapCalc.jsx';
import Heatmap from './Heatmap.jsx';

const dateFormat = new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
});

const Shareable = (props) => {

    let profile = props.profile;

    let biggestDay = props.biggestDay;
    let mostPlayedPack = props.mostPlayedPack;
    let mostPlayedSong = props.mostPlayedSong;

    return (
            <div className="stats-modal">
                <div className="stats-modal-logo">
                    <img src="./itgwrapped.png" />
                </div>
                <div className="stats-modal-grid">
                    <div className="stats-modal-item">Ended 2023 with <p className="value">{profile.numScores.toLocaleString()}</p> scores</div>
                    <div className="stats-modal-item">Stepped on <p className="value">{profile.notesHit.toLocaleString()}</p> notes</div>
                    <div className="stats-modal-item">Blew up <p className="value">{profile.minesHit.toLocaleString()}</p> mines</div>

                    {profile.grades && ("1" in profile.grades) &&
                    <div className="stats-modal-item">{profile.grades["1"].length || 0} Quad{profile.grades["1"].length>1 ? 's': ''}
                            <a>
                                {
                                    profile.grades["1"].map((score, index) =>
                                        index < 4 &&
                                        <div>
                                            <img className="stars" src={quadIcon} />
                                            <b>  {getSongName(score)}</b>
                                        </div>
                                    )}

                                {profile.grades["1"].length >= 4 &&
                                    <p>...and more!</p>
                                }
                            </a>
                        </div>
                    }

                    <div className="stats-modal-item">Made Disco Pop<p className="value">{profile.discoPop} times</p></div>
                <div className="stats-modal-item">Longest Session<p className="value">{dateFormat.format(Date.parse(biggestDay))}</p>{profile.daysPlayed[biggestDay]} scores</div>
                    <div className="stats-modal-item">Favorite Pack<p className="stats-modal-item-value">{mostPlayedPack}</p>{profile.packPlays[mostPlayedPack]} scores</div>
                    <div className="stats-modal-item">Favorite Song<p className="stats-modal-item-value">{mostPlayedSong}</p>{profile.songPlays[mostPlayedSong]} scores</div>
                    <div className="stats-modal-grades">
                        <div className="stats-modal-grades-container">
                            <img className="stats-modal-stars" src={quadIcon} />
                            <a>{("1" in profile.grades) && profile.grades["1"].length || 0}</a>
                        </div>
                        <div className="stats-modal-grades-container">
                            <img className="stats-modal-stars" src={triIcon} />
                            <a>{("2" in profile.grades) && profile.grades["2"].length || 0}</a>
                        </div>
                        <div className="stats-modal-grades-container">
                            <img className="stats-modal-stars" src={dubIcon} />
                            <a>{("3" in profile.grades) && profile.grades["3"].length || 0}</a>
                        </div>
                        <div className="stats-modal-grades-container">
                            <img className="stats-modal-stars" src={starIcon} />
                            <a>{("4" in profile.grades) && profile.grades["4"].length || 0}</a>
                        </div>
                    </div>
                </div>
                { props.isYear &&
                    <Heatmap dates={profile.daysPlayed} maxDay={profile.daysPlayed[biggestDay]} />
                }
            </div>
    );
}

export default Shareable;