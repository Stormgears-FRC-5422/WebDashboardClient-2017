import Inferno from "inferno";

import SyncedComponent from "../../lib/SyncedComponent";
import {ToggleType} from "./ToggleType";

export interface Checkbox {
	value: string;
	label: string;
	enabled: boolean;
}

export interface SyncedCheckboxesProps {
	label: string;
	path: string;
	width: number;
	large: boolean;
	enabled: boolean;
	entries: Checkbox[];
	toggleType: string;
}

interface SyncedCheckboxesState {
	data: any;
}

export default class SyncedCheckboxes extends SyncedComponent<SyncedCheckboxesProps, SyncedCheckboxesState> {
	private name = "SyncedCheckboxes_" + (Math.round(Math.random() * 100000));

	constructor(props) {
		super(props, props.path, "data");

		this.state = {
			data: ""
		};
	}

	public componentDidUpdate() {
		// FIXME: This appears to be a bug in Inferno's reconciler
		// for (let i = 0; i < this.inputs.length; i++) {
		// 	this.inputs[i].checked = this.state.data === this.inputs[i].value;
		// }
	}

	private inputs = [];

	private inputRef = (i) => {
		return (e) => {
			this.inputs[i] = e;
		};
	}

	private handleChange = (event) => {
		if (typeof this.state.data !== "object") {
			this.setRecord({
				[event.target.value]: event.target.checked
			});
		} else {
			this.setRecord(event.target.checked, `${this.path}.${event.target.value}`);
		}
	}

	public render() {
		const {props, state, name, inputRef, handleChange} = this;

		const buttons = [];

		const data = state.data || {};

		for (let i = 0; i < props.entries.length; i++) {
			const child = props.entries[i];

			buttons.push(<label htmlFor={name + "_" + i} className={"pt-control" + (props.large ? " pt-large" : "") + (ToggleType[props.toggleType as string] === ToggleType.SWITCH ? " pt-switch" : " pt-checkbox")} key={child.value}>
				<input
					ref={inputRef(i)}
					checked={data[child.value]}
					id={name + "_" + i}
					type="checkbox"
					value={child.value}
					label={child.label}
					name={name}
					onClick={handleChange}
					disabled={!props.enabled || !child.enabled}
				/>
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
