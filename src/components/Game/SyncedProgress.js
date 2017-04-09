import SyncedComponent from "../../lib/SyncedComponent";

import {ProgressBar} from "@blueprintjs/core/dist/components/progress/progressBar";
import {Intent} from "@blueprintjs/core/dist/common/intent";

export default class SyncedProgress extends SyncedComponent {
	name = "SyncedProgress_" + (Math.round(Math.random() * 100000));

	constructor(props) {
		super(props, props.path, "data");

		this.state = {
			data: 0
		};
	}

	render(props, state) {
		return <div>
			<label htmlFor={this.name} className="pt-label bold">{props.label}</label>
			<ProgressBar value={state.data} intent={Intent[props.intent]} className={props.large ? "pt-large" : ""} />
		</div>;
	}
}