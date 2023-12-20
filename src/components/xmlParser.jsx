import React from 'react';
import './xmlParser.css';
import stats from '../assets/Stats.xml';
import xmlJs from 'xml-js';


class XmlParser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
        }

        this.parse(props.stats);
    }


    async parse(path) {
        await fetch(path)
            .then((response) => response.text())
            .then((xmlText) => {
                console.log(path);
                const jsonData = xmlJs.xml2json(xmlText, { compact: true, spaces: 4 });
                console.log("Done parsing");
                this.setState({ data: jsonData })
            })
            .catch((error) => {
                console.error('Error fetching XML data:', error);
            });

    }

    render() {
        const { data } = this.state;
        return (
            
            <div>
                <div>{JSON.stringify(data)}</div>
            </div>
        );
    }
}

export default XmlParser;