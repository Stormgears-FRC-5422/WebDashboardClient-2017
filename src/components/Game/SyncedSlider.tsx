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

export default class SyncedSlider extends SyncedComponent<any, any> {
	private name = "SyncedSlider_" + (Math.round(Math.random() * 100000));

	constructor(props) {
		super(props, props.path, "data");

		this.state = {
			data: 0
		};
	}

	private handleSlider = (n) => {
		startDrag();
		this.setRecord(n);
	}

	public render() {
		const {props, state} = this;

		return <div>
			<label htmlFor={this.name} className="pt-label bold">{props.label}</label>
			<Slider {...props} disabled={!props.enabled} value={state.data} onChange={this.handleSlider} onRelease={stopDrag}/>
		</div>;
	}
}
