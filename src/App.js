import Inferno, { linkEvent } from 'inferno';
import React from "react";
import reactMixin from "react-mixin";
import DeepstreamMixin from "deepstream.io-tools-react";
import Component from 'inferno-component';
import {Slider} from "@blueprintjs/core";

function handleUpdate(key) {
	return function(i, e) {
		console.log(i, e);
		i.setState({
			[key]: e
		});
	}
}

const App = React.createClass({
	mixins: [DeepstreamMixin],
	render() {
		return (
			<div className="App">
				<h1>WebDashboard Prototype</h1>
				<Slider min={0} max={100} stepSize={1} labelStepSize={10} value={this.state.motor} onChange={(n) => {
					this.setState({
						motor: n
					});
				}}></Slider>
			</div>
		);
	}
});

// reactMixin(App.prototype, DeepstreamMixin);

export default App;
