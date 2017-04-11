import {Tabs2} from "@blueprintjs/core/dist/components/tabs2/tabs2";
import {Tab2} from "@blueprintjs/core/dist/components/tabs2/tab2";

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
			tab: "tab-game"
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
		this.setState({
			tab: n
		});
	};

	render(props, state) {
		let currTab = state.tab;
		return (
			<div className="App">
				<nav className="pt-navbar pt-fixed-top">
					<div className="pt-navbar-group pt-align-left">
						<div className="pt-navbar-heading">
							WebDashboard
						</div>
					</div>
					<div className="pt-navbar-group pt-align-left">
						<Tabs2 className="pt-large" onChange={this.handleTab} selectedTabId={state.tab}>
							<Tab2 id="tab-game" title="Game"/>
							<Tab2 id="tab-diagnostics" title="Diagnostics"/>
							<Tab2 id="tab-raw-data" title="Raw Data"/>
						</Tabs2>
					</div>
					<div className="pt-navbar-group pt-align-right">
						<ConnectionIndicator/>
					</div>
				</nav>
				<div className="navbar-spacer"/>

				{ currTab === "tab-game" ? <GameView /> : null}
				{ currTab === "tab-diagnostics" ? <DiagnosticsDisplay /> : null }
				{ currTab === "tab-raw-data" ? <RawData /> : null}

				<br />
				<h2>Logs</h2>
				<Console data={state.console} dataLength={state.consoleLength} />
				<Graphs/>
			</div>
		);
	}
}

export default App;
