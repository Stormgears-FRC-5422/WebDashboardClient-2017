import Inferno from "inferno";
import Component from "inferno-component";
import Devices from "./Devices";
import Talons from "./Talons";

import {Collapse, Button} from "@blueprintjs/core";

export default class DiagnosticsDisplay extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showDevices: false
		};
	}

	toggleDevices = () => {
		this.setState({
			showDevices: !this.state.showDevices
		});
	};

	render() {
		let devices = this.props.state.devices;
		let showDevices = this.state.showDevices;

		return <div>
			<h2>Motors</h2>
			<Talons talons={this.props.state.talons} />

			<h2>Devices</h2>
			<Button onClick={this.toggleDevices} className="pt-minimal" iconName={showDevices ? "chevron-down" : "chevron-right"}>{showDevices ? "Hide" : "Show"} Devices</Button>
			<Collapse isOpen={showDevices}>
				<br/>
				<Devices devices={devices} />
			</Collapse>
		</div>
	}
}