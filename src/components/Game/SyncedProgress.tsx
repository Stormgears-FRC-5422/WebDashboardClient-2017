import _ from "lodash";

import SyncedComponent from "../../lib/SyncedComponent";

import {Intent} from "@blueprintjs/core/dist/common/intent";
import {ProgressBar} from "@blueprintjs/core/dist/components/progress/progressBar";

export interface SyncedProgressProps {
	label: string;
	path: string;
	width: number;
	stripes: boolean;
	animated: boolean;
	intent: string;
}

interface SyncedProgressState {
	data: number;
}

export default class SyncedProgress extends SyncedComponent<SyncedProgressProps, SyncedProgressState> {
	private name = "SyncedProgress_" + (Math.round(Math.random() * 100000));

	constructor(props) {
		super(props, props.path, "data");

		this.state = {
			data: 0
		};
	}

	public shouldComponentUpdate(nP: SyncedProgressProps, nS: SyncedProgressState) {
		return this.state.data !== nS.data || !_.isEqual(nP, this.props);
	}

	public render() {
		const {props, state} = this;
		return <div>
			<label htmlFor={this.name} className="pt-label bold">{props.label}</label>
			<ProgressBar value={state.data} intent={Intent[props.intent as string]} className={props.large ? "pt-large" : ""} />
		</div>;
	}
}
