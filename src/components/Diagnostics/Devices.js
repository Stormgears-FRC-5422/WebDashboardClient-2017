import Inferno from "inferno";
import Component from "inferno-component";
import {NonIdealState} from "@blueprintjs/core";

import DeviceCard from "./DeviceCard";

export default class Devices extends Component {
	render() {
		let devices = this.props.devices;

		if (!devices || devices.length === 0) {
			return <NonIdealState title="No devices found." visual="warning-sign" />
		}

		let devCards = [];
		for (let i = 0; i < devices.length; i++) {
			let dev = devices[i];
			devCards.push(<DeviceCard dev={dev} />);
		}

		return <div className="row">
			{devCards}
		</div>
	}
}