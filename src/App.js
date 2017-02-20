//noinspection ES6UnusedImports,ES6UnusedImports
import Inferno from "inferno";
import SyncedComponent from "./lib/SyncedComponent";

import { Slider, Tab, TabList, TabPanel, Tabs } from "@blueprintjs/core";

import DiagnosticsDisplay from "./components/DiagnosticsDisplay";

import Statistic from "./components/Statistic";

import './App.css';

import Console from "./components/Console";


class App extends SyncedComponent {
	constructor(props) {
		super(props);

		this.state = {
			...this.state,
			local: {
				console: [
					{
						timestamp: (new Date()).toISOString(),
						type: "CLIENT",
						log: "Client connected",
						key: Math.round(Math.random() * 1000000)
					}
				],
				consoleLength: 1,
				tab: 0
			}
		};
	}

	// consoleRowRender({columnIndex, rowIndex, index}) {
	// 	let row = this.state.local.console[index];
	// 	return <div className="console-row">
	// 		[{row.timestamp}][{row.type}]: {row.log}
	// 	</div>
	// },
	componentDidMount() {
		const ds = global.ds;
		// this.rec = ds.record.getRecord("webdashboard");

		ds.event.subscribe("log", data => {
			// console.log(data);
			if (data) {
				this.state.local.console.push(data);
				this.setState({
					local: {
						...this.state.local,
						console: this.state.local.console,
						consoleLength: this.state.local.console.length
					}
				});
			}
		});
	}

	handleMotorSlider = (n) => {
		this.dsRecord.set("motor", n);
	};

	handleTab = (n) => {
		this.setState({
			local: {
				...this.state.local,
				tab: n
			}
		});
	};

	render() {
		let currTab = this.state.local.tab;
		return (
			<div className="App">
				<h1>WebDashboard</h1><br />
				<Tabs selectedTabIndex={currTab} onChange={this.handleTab}>
					<TabList className="pt-large">
						<Tab>Game</Tab>
						<Tab>Diagnostics</Tab>
					</TabList>
					<TabPanel>
						{ currTab === 0 ? <div>
								<Slider value={this.state.motor} onChange={this.handleMotorSlider} />
								<hr/>
								<div className="row">
									<div className="col-md-4">
										<div className="box">
											<Statistic big={this.state.motor} small="Motor" reverse={true} />
										</div>
									</div>
									<div className="col-md-4">
										<div className="box">
											(placeholder)
										</div>
									</div>
									<div className="col-md-4">
										<div className="box">
											(placeholder)
										</div>
									</div>
								</div>
							</div> : null}
					</TabPanel>
					<TabPanel>
						{ currTab === 1 ? <DiagnosticsDisplay state={this.state} /> : null }
					</TabPanel>
				</Tabs>
				<br />
				<h2>Logs</h2>
				<Console data={this.state.local.console} dataLength={this.state.local.consoleLength} />
			</div>
		);
	}
}

export default App;
