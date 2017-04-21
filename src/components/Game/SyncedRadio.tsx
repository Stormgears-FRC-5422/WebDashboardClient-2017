import _ from "lodash";

import SyncedComponent from "../../lib/SyncedComponent";
import {ToggleType} from "./ToggleType";

export interface Radio {
	value: string;
	label: string;
	enabled: boolean;
}

export interface SyncedRadioProps {
	label: string;
	path: string;
	width: number;
	large: boolean;
	enabled: boolean;
	entries: Radio[];
	toggleType: string;
}

interface SyncedRadioState {
	data: string;
}

export default class SyncedRadio extends SyncedComponent<SyncedRadioProps, SyncedRadioState> {
	private name = "SyncedRadio_" + (Math.round(Math.random() * 100000));

	constructor(props) {
		super(props, props.path, "data");

		this.state = {
			data: ""
		};
	}

	public shouldComponentUpdate(nP: SyncedRadioProps, nS: SyncedRadioState) {
		return this.state.data !== nS.data || !_.isEqual(this.props, nP);
	}

	public componentDidUpdate() {
		// FIXME: This appears to be a bug in Inferno's reconciler
		for (let i = 0; i < this.inputs.length; i++) {
			this.inputs[i].checked = this.state.data === this.inputs[i].value;
		}
	}

	private inputs = [];

	private inputRef = (i) => {
		return (e) => {
			this.inputs[i] = e;
		};
	}

	private handleChange = (event) => {
		this.setRecord(event.target.value);
	}

	public render() {
		const {props, state, name, inputRef, handleChange} = this;

		const buttons = [];

		for (let i = 0; i < props.entries.length; i++) {
			const child = props.entries[i];

			buttons.push(<label htmlFor={name + "_" + i} className={"pt-control" + (props.large ? " pt-large" : "") + (ToggleType[props.toggleType as string] === ToggleType.SWITCH ? " pt-switch" : " pt-radio")} key={child.value}>
				<input
					ref={inputRef(i)}
					checked={state.data === child.value}
					id={name + "_" + i}
					type="radio"
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
