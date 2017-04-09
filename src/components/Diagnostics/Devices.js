import SyncedComponent from "../../lib/SyncedComponent";
import {NonIdealState} from "@blueprintjs/core/dist/components/non-ideal-state/nonIdealState";

import DeviceCard from "./DeviceCard";

export default class Devices extends SyncedComponent {
	constructor(props) {
		super(props, "devices", "devices", "diagnostics");
		this.state = {
			devices: []
		};
	}

	render() {
		let devices = this.state.devices;

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