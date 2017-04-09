import Component from "inferno-component";

import Devices from "./Devices";
import Talons from "./Talons";
import AHRS from "./AHRS";

import {Tab2} from "@blueprintjs/core/dist/components/tabs2/tab2";
import {Tabs2} from "@blueprintjs/core/dist/components/tabs2/tabs2";

export default class DiagnosticsDisplay extends Component {
	render() {
		return <div>
			<Tabs2 vertical renderActiveTabPanelOnly>
				<Tab2 id="motors" title="Motors" panel={<Talons />} />
				<Tab2 id="ahrs" title="NavX MXP" panel={<AHRS />} />
				<Tab2 id="devices" title="Devices" panel={<Devices />} />
			</Tabs2>
		</div>
	}
}