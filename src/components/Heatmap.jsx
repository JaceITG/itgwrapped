import React from 'react';
import { getMaxDict } from './wrapCalc';

class Heatmap extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			calendar: [],
		}

		this.parseDates()
	}

	async parseDates() {
		let year = []
		//let calendarGrid = [];
		let daysPlayed = Object.keys(this.props.dates)

		// Populate year array with months
		for (let i = 0; i < 12; i++) {
			let numDays = 0;
			if (i === 1) {
				numDays = 28
			} else {
				numDays = 31 - (i % 2);
			}
			let mo = new Array(numDays).fill(0);
			year[i] = mo;
		}

		//Populate Calendar display grid with weekdays
		//for (let i=0; i < 7; i++) calendarGrid.push([]);

		// john fucking madden
		daysPlayed.forEach((day) => {
			year[parseInt(day.substring(5, 7)) - 1][parseInt(day.substring(8, 10)) - 1] = this.props.dates[day]
		})
		this.state = { calendar: year };
	}


	render() {
		let { calendar } = this.state;
		return (
			<div className = "heatmap-wrapper">
				<div className = "heatmap-header">
					<p className = "heatmap-header-title">Heatmap</p>
					<div className = "heatmap-legend">
						<p className = "heatmap-legend-num">0</p>
						<div className = "heatmap-legend-colors"></div>
						<p className = "heatmap-legend-num">{this.props.maxDay}</p>
					</div>
				</div>
				<div className = "heatmap">
					{calendar.map((month) => {
						return (<div className = "heatmap-month">
							{month.map((day) => {
								let squareColor = { "background": 
									`rgb(
										${255 * (day / this.props.maxDay) + 220 * (1 - (day / this.props.maxDay))}, 
										${28 * (day / this.props.maxDay) + 220 * (1 - (day / this.props.maxDay))}, 
										${102 * (day / this.props.maxDay) + 220 * (1 - (day / this.props.maxDay))})` 
								}
								return (<div className="heatmap-square" style={squareColor}> </div>)
							})}
						</div>)
					})}
				</div>
			</div>
		)
	}
}

export default Heatmap;