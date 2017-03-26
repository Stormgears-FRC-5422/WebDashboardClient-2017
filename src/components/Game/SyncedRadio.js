import {linkEvent} from "inferno";
import SyncedComponent from "../../lib/SyncedComponent";

function handleChange(instance, event) {
	instance.setRecord(event.target.value);
}

export default class SyncedRadio extends SyncedComponent {
	name = "SyncedRadio_" + (Math.round(Math.random() * 100000));

	constructor(props) {
		super(props, props.path, "data");

		this.state = {
			data: ""
		};
	}

	componentDidUpdate() {
		// FIXME: This appears to be a bug in Inferno's reconciler
		for (let i = 0; i < this.inputs.length; i++) {
			this.inputs[i].checked = this.state.data === this.inputs[i].value;
		}
	}

	inputs = [];

	inputRef = (i) => {
		return (e) => {
			this.inputs[i] = e;
		}
	};

	render(props, state) {
		let {name, inputRef} = this;
		let buttons = [];

		for (let i = 0; i < props.entries.length; i++) {
			let child = props.entries[i];

			buttons.push(<label htmlFor={name + "_" + i} className={"pt-control" + (props.large ? " pt-large" : "") + (props.toggleType === "SWITCH" ? " pt-switch" : " pt-radio")} key={child.value}>
				<input ref={inputRef(i)} checked={state.data === child.value} id={name + "_" + i} type="radio"
				       value={child.value} label={child.label} name={name} onClick={linkEvent(this, handleChange)} disabled={!props.enabled || !child.enabled} />
				<span className="pt-control-indicator"/>
				{child.label}
			</label>);
		}

		return <div>
			<label className="pt-label bold">{props.label}</label>
			{buttons}
		</div>;
	}
}
