import Inferno from "inferno";

import _ from "lodash";

import SyncedComponent from "../../lib/SyncedComponent";

import {Slider} from "@blueprintjs/core/dist/components/slider/slider";

function startDrag() {
	document.body.style.userSelect = "none";
	global["dragging"] = true;
}
function stopDrag() {
	document.body.style.userSelect = "";
	global["dragging"] = false;
}

export interface SyncedSliderProps {
	path: string;
	width: number;
	enabled: boolean;
	min: number;
	max: number;
	stepSize: number;
	labelStepSize: number;
}

interface SyncedSliderState {
	data: number;
}

export default class SyncedSlider extends SyncedComponent<SyncedSliderProps, SyncedSliderState> {
	private name = "SyncedSlider_" + (Math.round(Math.random() * 100000));

	constructor(props) {
		super(props, props.path, "data");

		this.state = {
			data: 0
		};
	}

	public shouldComponentUpdate(nP: SyncedSliderProps, nS: SyncedSliderState) {
		return this.state.data !== nS.data || !_.isEqual(this.props, nP);
	}

	private handleSlider = (n) => {
		startDrag();
		this.setRecord(n);
	}

	public render() {
		const {props, state} = this;

		return <div>
			<label htmlFor={this.name} className="pt-label bold">{props.label}</label>
			<Slider
				disabled={!props.enabled}
				min={props.min} max={props.max}
				stepSize={props.stepSize} labelStepSize={props.labelStepSize}
				value={state.data}
				onChange={this.handleSlider} onRelease={stopDrag}
			/>
		</div>;
	}
}
