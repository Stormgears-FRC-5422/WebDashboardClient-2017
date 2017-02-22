import Inferno from "inferno";
import SyncedComponent from "../../lib/SyncedComponent";

import { Slider } from "@blueprintjs/core";

function startDrag() {
	document.body.style.userSelect = "none";
	global.dragging = true;
}
function stopDrag() {
	document.body.style.userSelect = "";
	global.dragging = false;
}

export default class SyncedSlider extends SyncedComponent {
	constructor(props) {
		super(props, props.path, "data");

		this.state = {
			data: 0
		};
	}

	handleSlider = (n) => {
		startDrag();
		this.setRecord(n);
	};

	render() {
		return <Slider {...this.props} value={this.state.data} onChange={this.handleSlider} onRelease={stopDrag} />;
	}
}
