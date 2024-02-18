import { useState, useCallback } from 'react'
import XmlParser from './components/xmlParser';
import StatsGuide from './components/StatsGuide';
import Dropzone from 'react-dropzone';
import Logo from './assets/logo.svg?react';

function App() {
    const startDate = new Date("2024-02-01T00:00:00");
    const endDate = new Date("2024-03-01T00:00:00");

    const [file, setFile] = useState(0);

    //Read dropped file as Data URL
    const handleChange = useCallback((acceptedFiles) => {
        acceptedFiles.forEach((file) => {
            const reader = new FileReader()

            reader.onabort = () => console.log('file reading was aborted');
            reader.onerror = () => console.log('file reading has failed');
            reader.onload = () => {
                const dataUrl = reader.result
                setFile(dataUrl);
            }
            reader.readAsDataURL(file);
        })
    });

    return (
        <>
            {file === 0 ?
                <div className="title-screen">
                    <div className="title-screen-text-wrapper">
                        <Logo className='title-screen-logo' />
                        <p className="title-screen-text-dgef">#DGEF24</p>
                        <p className="title-screen-text-sub">Made by <a className="title-screen-text-link" href="https://github.com/JaceITG">JaceITG</a> and <a className="title-screen-text-link" href="https://github.com/soraeee">sorae</a>
                        </p>
                    </div>
                    <Dropzone onDrop={acceptedFiles => handleChange(acceptedFiles)}>
                        {({ getRootProps, getInputProps }) => (
                            <section>
                                <div className="title-screen-dropzone" {...getRootProps()}>
                                    <input {...getInputProps()} />
                                    <p className="title-screen-text-info">Import a Stats.xml here!</p>
                                </div>
                            </section>
                        )}
                    </Dropzone>
                    <StatsGuide className="info-box" />
                    <div>
                        <a className="info-box-text">To combine scores set across ITG and FA+ gamemodes, try out </a>
                        <a className="info-box-text-link" href="https://mergestats.itgmania.com/">Teejusb's Stats Merger</a>
                    </div>
                    <div className="info-warning">
                        <p>⚠ Please note that scores coming from setups not using ITGMania + Simply Love may cause inaccurate stats or break stuff... oops.</p>
                    </div>
                </div>
                :
                <div className="container">
                    <XmlParser stats={file} subtitle={"#DGEF24"} start={startDate} end={endDate} isYear={false} />
                </div>
            }
        </>
    )
}

export default App
