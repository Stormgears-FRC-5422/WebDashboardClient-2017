import Inferno from "inferno";
import Component from "inferno-component";
import Devices from "./Devices";
import Talons from "./Talons";

import {Collapse, Button, Tab, Tabs, TabList, TabPanel} from "@blueprintjs/core";

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
			<Tabs className="pt-vertical">
				<TabList>
					<Tab>Motors</Tab>
					<Tab>Devices</Tab>
				</TabList>
				<TabPanel>
					<Talons talons={this.props.state.talons} />
				</TabPanel>
				<TabPanel>
					<Devices devices={devices} />
				</TabPanel>
			</Tabs>
		</div>
	}
}