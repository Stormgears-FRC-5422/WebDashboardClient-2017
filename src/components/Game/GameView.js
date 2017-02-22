import Inferno from "inferno";
import Component from "inferno-component";

import {Radio} from "@blueprintjs/core";

import SyncedSlider from "./SyncedSlider";
import SyncedDropdown from "./SyncedDropdown";
import SyncedRadio from "./SyncedRadio";

export default function GameView(props) {
	return <div>
		<SyncedSlider path="motor"/>
		<hr/>
		<div className="row">
			<div className="col-md-4">
				<div className="box">
					{/*<label htmlFor="alliance-select" className="pt-label">*/}
						{/*Alliance*/}
						{/*<SyncedDropdown id="alliance-select" path="alliance">*/}
							{/*<option value="red">Red (boiler right of airship)</option>*/}
							{/*<option value="blue">Blue (boiler left)</option>*/}
						{/*</SyncedDropdown>*/}
					{/*</label>*/}
					<SyncedRadio label="Alliance" path="alliance">
						<Radio label="Red (boiler right of airship)" value="red"/>
						<Radio label="Blue (boiler left of airship)" value="blue"/>
					</SyncedRadio>
				</div>
			</div>
			<div className="col-md-4">
				<div className="box">
					(placeholder)
				</div>
			</div>
			<div className="col-md-4">
				<div className="box">
					(placeholder)
				</div>
			</div>
		</div>
	</div>;
}