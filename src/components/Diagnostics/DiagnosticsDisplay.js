import Inferno from "inferno";
import Component from "inferno-component";
import Devices from "./Devices";
import Talons from "./Talons";

import {Tab, Tabs, TabList, TabPanel} from "@blueprintjs/core";

export default class DiagnosticsDisplay extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tab: 0
		};
	}

	handleTab = (n) => {
		this.setState({ tab: n });
	};

	render() {
		let currTab = this.state.tab;

		return <div>
			<Tabs className="pt-vertical" selectedTabIndex={currTab} onChange={this.handleTab}>
				<TabList>
					<Tab>Motors</Tab>
					<Tab>Devices</Tab>
				</TabList>
				<TabPanel>
					<Talons />
				</TabPanel>
				<TabPanel>
					<Devices />
				</TabPanel>
			</Tabs>
		</div>
	}
}