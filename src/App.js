import React from 'react';
import DeepstreamMixin from "deepstream.io-tools-react";
import './App.css';
import {Slider} from "@blueprintjs/core/dist/components/slider/slider";

// import {CellMeasurer, List} from "react-virtualized";
import Console from "./components/Console";

import Statistic from "./components/Statistic";

const App = React.createClass({
	getInitialState() {
		return {
			local: {
				console: [
					{
						timestamp: (new Date()).toISOString(),
						type: "CLIENT",
						log: "Client connected",
						key: Math.round(Math.random() * 1000000)
					}
				],
				consoleLength: 1
			}
		}
	},
	mixins: [DeepstreamMixin],
	// consoleRowRender({columnIndex, rowIndex, index}) {
	// 	let row = this.state.local.console[index];
	// 	return <div className="console-row">
	// 		[{row.timestamp}][{row.type}]: {row.log}
	// 	</div>
	// },
	componentDidMount() {
		const ds = global.ds;
		this.rec = ds.record.getRecord("webdashboard");
		ds.event.subscribe("log", data => {
			// console.log(data);
			if (data) {
				this.state.local.console.push(data);
				this.setState({
					local: {
						console: this.state.local.console,
						consoleLength: this.state.local.console.length
					}
				});
			}


		});
	},
	render() {
		return (
			<div className="App">
				<h1>WebDashboard Prototype!</h1>
				<Slider value={this.state.motor} onChange={(n) => this.setState({ motor: n })} />
				<hr/>
				<div className="row">
					<div className="col-md-4">
						<div className="box">
							<Statistic big={this.state.motor} small="Motor" reverse={true} />
						</div>
					</div>
					<div className="col-md-4">
						<div className="box">
							WOOF
						</div>
					</div>
					<div className="col-md-4">
						<div className="box">
							QUACK
						</div>
					</div>
				</div>
				<br />
				<h2>Logs</h2>
				{/* maybe optimize the console later <CellMeasurer*/}
					{/*cellRenderer={this.consoleRowRender}*/}
					{/*columnCount={1}*/}
					{/*rowCount={this.state.local.console.length}*/}
					{/*width={800}*/}
				{/*>*/}
					{/*{({ getRowHeight }) => (*/}
						{/*<List*/}
							{/*height={600}*/}
							{/*rowHeight={getRowHeight}*/}
							{/*rowRenderer={({ index, isScrolling  }) => collection.getIn([index, "name"])}*/}
							{/*width={800}*/}
						{/*/>*/}
					{/*)}*/}
				{/*</CellMeasurer>*/}
				<Console data={this.state.local.console} dataLength={this.state.local.consoleLength} />
			</div>
		);
	}
});

export default App;
