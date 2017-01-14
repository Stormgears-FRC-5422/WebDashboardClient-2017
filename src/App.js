import React from 'react';
import DeepstreamMixin from "deepstream.io-tools-react";
import './App.css';
import {Slider} from "@blueprintjs/core/dist/components/slider/slider";

import Statistic from "./components/Statistic";

const App = React.createClass({
	mixins: [DeepstreamMixin],
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
				<h2>Logs</h2>

			</div>
		);
	}
});

export default App;
