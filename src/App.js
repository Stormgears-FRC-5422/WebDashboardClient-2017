//noinspection ES6UnusedImports,ES6UnusedImports
import Inferno from "inferno";
import SyncedComponent from "./lib/SyncedComponent";

import { Slider, Tab, TabList, TabPanel, Tabs } from "@blueprintjs/core";

import DiagnosticsDisplay from "./components/DiagnosticsDisplay";
import Statistic from "./components/Statistic";
import Console from "./components/Console";
import RawData from "./components/RawData";

import './App.css';

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
				tab: 1
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
		const _this = this;
		return function() {
			_this.setState({
				local: {
					..._this.state.local,
					tab: n
				}
			});
		};
	};

	render() {
		let currTab = this.state.local.tab;
		return (
			<div className="App">
				<nav className="pt-navbar pt-fixed-top">
					<div className="pt-navbar-group pt-align-left">
						<div className="pt-navbar-heading">
							WebDashboard
						</div>
						<div className="pt-button-group pt-minimal">
							<button onClick={this.handleTab(1)} className={"pt-button pt-icon-dashboard" + (currTab === 1 ? " pt-active" : "")}>Game</button>
							<button onClick={this.handleTab(2)} className={"pt-button pt-icon-pulse" + (currTab === 2 ? " pt-active" : "")}>Diagnostics</button>
							<button onClick={this.handleTab(3)} className={"pt-button pt-icon-database" + (currTab === 3 ? " pt-active" : "")}>Raw Data</button>
						</div>
					</div>
				</nav>
				<div style={{ marginBottom: "75px" }}></div>

				{ currTab === 1 ? <div>
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
				{ currTab === 2 ? <DiagnosticsDisplay state={this.state} /> : null }
				{ currTab === 3 ? <RawData data={this.state} /> : null}

				<br />
				<h2>Logs</h2>
				<Console data={this.state.local.console} dataLength={this.state.local.consoleLength} />
			</div>
		);
	}
}

export default App;
