import React from 'react';
import { getMaxDict } from './wrapCalc';

class Heatmap extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			calendar: [],
		}

		this.parseDates()
		console.log(this.props)
	}

	async parseDates() {
		let year = []
		let calendarGrid = [];
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
		for (let i=0; i < 7; i++) calendarGrid.push([]);

		// john fucking madden
		daysPlayed.forEach((dateTime) => {
			let month = parseInt(dateTime.substring(5, 7));
			let day = parseInt(dateTime.substring(8, 10));
			console.log(month + ", " + day);
			year[month - 1][day - 1] = this.props.dates[dateTime]
		})

		// Build calendar grid column-wise
		let count = 0;
		year.forEach( (month) => {
			month.forEach((day) => {
				calendarGrid[count%7].push(day);
				count++;
			});
		});


		console.log(calendarGrid);
		this.state = {calendar: calendarGrid};
	}


	render() {
		let {calendar} = this.state;
		console.log(calendar);
		let max = this.props.dates[getMaxDict(this.props.dates)];

		if (calendar.length === 0) {
			return (
				<div className="stats-wrapper">
					Processing scores...
				</div>
			);
		}

		return (
			<>
				<div>
					<p>FUCK OFF</p>
					<table className='calendar'>
						<tr>
							<th>Months</th>
						</tr>
						<tbody>
							{calendar.map((weekday) => {
								return (<tr>
									{weekday.map((day) => {
									let gValue = Math.floor((day/max)*255)
									let style = {backgroundColor: "#00"+gValue.toString(16)+"00"};
									return (<td style={style}> </td>)
									})}
								</tr>)
							})}
						</tbody>
					</table>
				</div>
			</>
		)
	}
}

export default Heatmap;