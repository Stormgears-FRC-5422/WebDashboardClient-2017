import SyncedComponent from "./lib/SyncedComponent";

import DiagnosticsDisplay from "./components/Diagnostics/DiagnosticsDisplay";
import Console from "./components/Console";
import RawData from "./components/RawData";
import GameView from "./components/Game/GameView";
import ConnectionIndicator from "./components/ConnectionIndicator";

import Graphs from "./components/Graphs/Graphs";

import './App.css';

global.dragging = false;
document.onselectstart = function(e) {
	if (global.dragging) {
		e.preventDefault();
		return false;
	}
};

class App extends SyncedComponent {
	constructor(props) {
		super(props, "motor", "motor");

		this.state = {
			console: [
				{
					timestamp: (new Date()).toISOString(),
					type: "CLIENT",
					log: "Client loaded",
					key: Math.round(Math.random() * 1000000)
				}
			],
			consoleLength: 1,
			tab: 1
		};
	}

	componentWillMount() {
		super.componentWillMount();

		const ds = global.ds;

		ds.event.subscribe("log", this.handleLog);

		ds.presence.subscribe((user, loggedIn) => {
			this.handleLog({
				timestamp: (new Date()).toISOString(),
				type: "PRESENCE",
				log: user + " " + (loggedIn ? "connected" : "disconnected")
			});
		});
	}

	handleLog = data => {
		// console.log(data);
		if (data) {
			this.state.console.push(data);
			this.setState({
				console: this.state.console,
				consoleLength: this.state.console.length
			});
		}
	};

	componentDidUnmount() {
		super.componentDidUnmount();

		global.ds.event.unsubscribe(this.handleLog);
	}


	handleTab = (n) => {
		const _this = this;
		return function() {
			_this.setState({
				tab: n
			});
		};
	};

	render() {
		let currTab = this.state.tab;
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
					<div className="pt-navbar-group pt-align-right">
						<ConnectionIndicator/>
					</div>
				</nav>
				<div className="navbar-spacer"/>

				{ currTab === 1 ? <GameView /> : null}
				{ currTab === 2 ? <DiagnosticsDisplay /> : null }
				{ currTab === 3 ? <RawData /> : null}

				<br />
				<h2>Logs</h2>
				<Console data={this.state.console} dataLength={this.state.consoleLength} />
				<Graphs/>
			</div>
		);
	}
}

export default App;
