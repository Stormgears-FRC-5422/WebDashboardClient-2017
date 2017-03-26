import {Radio, NonIdealState} from "@blueprintjs/core";

import SyncedComponent from "../../lib/SyncedComponent";
import SyncedSlider from "./SyncedSlider";
import SyncedRadio from "./SyncedRadio";
import {Spinner} from "@blueprintjs/core/dist/components/spinner/spinner";
import SyncedProgress from "./SyncedProgress";

export default class GameView extends SyncedComponent {
	constructor(props) {
		super(props, "game", "controls", "config");
	}

	render(props, {controls}) {
        if (!controls || controls.length === 0) {
            return <NonIdealState title="No controls set." description="TODO: Write documentation for this." visual="help" />
        }

        let components = [];
        for (let i = 0; i < controls.length; i++) {
        	let c = controls[i];
        	let a;
        	switch (c.type) {
				case "SLIDER":
					a = <SyncedSlider {...c} />;
					break;
				case "RADIOS":
					a = <SyncedRadio {...c} />;
					break;
				case "PROGRESS":
					a = <SyncedProgress {...c} />;
					break;
				default:
					a = <div>Unknown component type</div>;
					break;

			}
			components.push(<div className={`col-md-${c.width}`}>
				<div className="box game-control-box">
					{a}
				</div>
			</div>)
		}

        return <div>
			<div className="row">
				{ components }
			</div>
		</div>;
	}
}
