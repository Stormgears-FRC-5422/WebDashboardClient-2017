import Inferno from "inferno";

import {NonIdealState} from "@blueprintjs/core/dist/components/non-ideal-state/nonIdealState";
import SyncedComponent from "../../lib/SyncedComponent";

import DeviceCard from "./DeviceCard";

export interface Device {
	description: string;
	id: string;
	idType: string;
	manufacturer: string;
	path: string;
	properties: any;
	type: string;
}

interface DevicesState {
	devices: Device[];
}

export default class Devices extends SyncedComponent<{}, DevicesState> {
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
			devCards.push(<DeviceCard dev={dev} key={dev.id} />);
		}

		return <div className="row" hasKeyedChildren>
			{devCards}
		</div>;
	}
}
