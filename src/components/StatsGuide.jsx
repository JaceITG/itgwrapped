import React from 'react';
import Popup from 'reactjs-popup';

const StatsGuide = () => {
    return (
        <Popup trigger=
            {<div className="info-box"><div className='info-box-text'>How do I find my Stats.xml?</div></div>}
            modal nested>
            {
                close => (
                    <div className='info-modal' onClick=
                        {() => close()}>
                        <div className='info-modal-content'>
                            <h1>Finding Your Stats.xml</h1>
                            <ul>
                                <li>Open your computer's file explorer</li>
                                <li>Navigate to the local files used by ITGMania, commonly found in these places:
                                    <p>Windows:  %APPDATA%/ITGmania/</p>
                                    <p>Linux:  ~/.itgmania/</p>
                                    <p>macOS:  ~/Library/Application Support/ITGmania/</p>
                                </li>
                                <li>Open folder:
                                    <p>Save &gt; LocalProfiles &gt; &#091;Profile ID&#093; </p>
                                </li>
                                <li>Note: Profile IDs are generated chronologically; yours may be the first one if playing on a personal setup!</li>
                            </ul>
                        </div>
                        <div className='info-modal-close'>
                            <p>
                                Click anywhere to close this popup
                            </p>
                        </div>
                    </div>
                )
            }
        </Popup>
    )
};

export default StatsGuide;