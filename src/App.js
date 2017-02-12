import React from 'react';
import DeepstreamMixin from "deepstream.io-tools-react";

import { Slider, Tab, TabList, TabPanel, Tabs } from "@blueprintjs/core";
// import {Tabs} from "@blueprintjs/core/dist/components/tabs/tabs";
// import {Tab} from "@blueprintjs/core/dist/components/tabs/tab";
// import {TabList} from "@blueprintjs/core/dist/components/tabs/tabList";
// import {TabPanel} from "@blueprintjs/core/dist/components/tabs/tabPanel";
// import {Slider} from "@blueprintjs/core/dist/components/slider/slider";

import DiagnosticsDisplay from "./components/DiagnosticsDisplay";

import Statistic from "./components/Statistic";

import './App.css';

// import {CellMeasurer, List} from "react-virtualized";
import Console from "./components/Console";

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
				<h1>WebDashboard</h1><br />
				<Tabs initialSelectedTabIndex={0}>
					<TabList>
						<Tab>Game</Tab>
						<Tab>Diagnostics</Tab>
					</TabList>
					<TabPanel>
						<div>
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
						</div>
					</TabPanel>
					<TabPanel>
						<DiagnosticsDisplay state={this.state} />
					</TabPanel>
				</Tabs>
				<br />
				<h2>Logs</h2>
				<Console data={this.state.local.console} dataLength={this.state.local.consoleLength} />
			</div>
		);
	}
});

export default App;
