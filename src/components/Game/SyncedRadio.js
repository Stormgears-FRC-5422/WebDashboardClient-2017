import Inferno, {linkEvent} from "inferno";
import SyncedComponent from "../../lib/SyncedComponent";

import {RadioGroup} from "@blueprintjs/core";

function handleChange(instance, event) {
	instance.setRecord(event.target.value);
}

export default class SyncedRadio extends SyncedComponent {
	name = "SyncedRadio_" + (Math.round(Math.random() * 10000) / 1000);

	constructor(props) {
		super(props, props.path, "data");

		this.state = {
			data: ""
		};
	}

	render() {
		let buttons = [];
		// TODO: Figure out a cleaner way
		for (let i = 0; i < this.props.children.length; i++) {
			let child = this.props.children[i];

			buttons.push(<label htmlFor={this.name + "_" + i} className="pt-control pt-radio" key={child.props.value}>
				<input checked={this.state.data === child.props.value} id={this.name + "_" + i} type="radio"
				       value={child.props.value} label={child.props.label} name={this.name} onClick={linkEvent(this, handleChange)}/>
				<span className="pt-control-indicator"/>
				{child.props.label}
			</label>);
		}

		return <div>
			<label className="pt-label">{this.props.label}</label>
			{buttons}
		</div>;
	}
}
