import React from 'react';
import './xmlParser.css';
import stats from '../assets/Stats.xml';
import xmlJs from 'xml-js';
import JSONPretty from 'react-json-pretty';


class XmlParser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            profile: {},
        }

        this.readXML(props.stats);
    }

    async parseStats(obj){
        //Collect profile username
        let profile = { username: obj["Stats"]["GeneralData"]["DisplayName"]["_text"] };

        this.setState({ profile: profile });
    }

    async readXML(path) {
        await fetch(path)
            .then((response) => response.text())
            .then((xmlText) => {
                console.log(path);
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
        const { data, profile } = this.state;
        return (
            
            <div>
                <div>Player: {profile.username}</div>
                <JSONPretty id="json-pretty" data={data}></JSONPretty>
            </div>
        );
    }
}

export default XmlParser;