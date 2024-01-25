import React from 'react';

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
		console.log(year)
		this.setState({calendar: year});
	}


	render() {
		let {calendar} = this.state;
		return (
			<>
				<div>
					{/*this.props.dates.map((data) => {
						return (
							<p>fuck off {data}</p>
						)
					})*/}
					<p>FUCK OFF</p>
					{calendar.map((help) => {
						return (<p>{help}</p>)
					})}
				</div>
			</>
		)
	}
}

export default Heatmap;