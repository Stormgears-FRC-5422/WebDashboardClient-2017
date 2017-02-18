import React from "react";
import Devices from "./Devices";
import Talons from "./Talons";

export default class DiagnosticsDisplay extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			expandedDeviceProps: {}
		};
	}

	render() {
		let devices = this.props.state.devices;

		return <div>
			<h2>Motors</h2>
			<Talons talons={this.props.state.talons} />

			<h2>Devices</h2>
			<Devices devices={devices} />
		</div>
	}
}