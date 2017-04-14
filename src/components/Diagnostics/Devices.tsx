import {NonIdealState} from "@blueprintjs/core/dist/components/non-ideal-state/nonIdealState";
import SyncedComponent from "../../lib/SyncedComponent";

import DeviceCard from "./DeviceCard";

export default class Devices extends SyncedComponent<any, any> {
	constructor(props) {
		super(props, "devices", "devices", "diagnostics");
		this.state = {
			devices: []
		};
	}

	public render() {
		const devices = this.state.devices;

		if (!devices || devices.length === 0) {
			return <NonIdealState title="No devices found." visual="warning-sign" />;
		}

		const devCards = [];
		for (let i = 0; i < devices.length; i++) {
			const dev = devices[i];
			devCards.push(<DeviceCard dev={dev} />);
		}

		return <div className="row">
			{devCards}
		</div>;
	}
}
