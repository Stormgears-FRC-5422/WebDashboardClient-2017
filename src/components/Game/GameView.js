import {Radio} from "@blueprintjs/core";

import SyncedSlider from "./SyncedSlider";
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
					<SyncedRadio label="Gear Placement" path="gearPlacement">
						<Radio label="Place Gear Left" value="left"/>
						<Radio label="Place Gear Center" value="center"/>
						<Radio label="Place Gear Right" value="right"/>
						<Radio label="Not Moving in Autonomous" value="none"/>
					</SyncedRadio>
				</div>
			</div>
			<div className="col-md-4">
				<div className="box">
					<SyncedRadio label="Drop-Off Location" path="gearDropOff">
						<Radio label="Drop Off at Gear Pickup" value="gearPickup"/>
						<Radio label="Drop Off at Baseline" value="baseline"/>
					</SyncedRadio>
				</div>
			</div>
		</div>
	</div>;
}