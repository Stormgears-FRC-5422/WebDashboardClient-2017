import {NonIdealState} from "@blueprintjs/core/dist/components/non-ideal-state/nonIdealState";

import SyncedComponent from "../../lib/SyncedComponent";
import SyncedProgress from "./SyncedProgress";
import SyncedRadio from "./SyncedRadio";
import SyncedSlider from "./SyncedSlider";

export default class GameView extends SyncedComponent<any, any> {
	constructor(props) {
		super(props, "game", "controls", "config");

		this.state = {};
	}

	public render() {
		const {state} = this;
		const controls = state.controls;
		if (!controls || controls.length === 0) {
			return <NonIdealState title="No controls set." description="TODO: Write documentation for this." visual="help" />;
		}

		const components = [];
		for (let i = 0; i < controls.length; i++) {
			const c = controls[i];
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
			</div>);
		}

		return <div>
			<div className="row">
				{ components }
			</div>
		</div>;
	}
}
