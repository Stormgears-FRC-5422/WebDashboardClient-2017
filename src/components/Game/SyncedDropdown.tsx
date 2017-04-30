import Inferno from "inferno";

import _ from "lodash";

import SyncedComponent from "../../lib/SyncedComponent";

export interface Option {
	label: string;
	value: string;
}

export interface SyncedDropdownProps {
	label: string;
	path: string;
	width: number;
	large: boolean;
	enabled: boolean;
	options: Option[];
}

interface SyncedDropdownState {
	data: string;
}

export default class SyncedDropdown extends SyncedComponent<SyncedDropdownProps, SyncedDropdownState> {
	private name = "SyncedDropdown" + (Math.round(Math.random() * 100000));

	constructor(props) {
		super(props, props.path, "data");

		this.state = {
			data: ""
		};
	}

	public shouldComponentUpdate(nP: SyncedDropdownProps, nS: SyncedDropdownState) {
		const {props, state} = this;
		return state.data !== nS.data || !_.isEqual(props, nP);
	}

	private handleChange = (event) => {
		this.setRecord(event.target.value);
	}

	public render() {
		const {props, state, name} = this;
		const children = [];
		for (let i = 0; i < props.options.length; i++) {
			const option = props.options[i];

			children.push(<option key={option.value} value={option.value}>{option.label}</option>);
		}
		return <label htmlFor={name} className="pt-label bold">
			{props.label}
			<br/>
			<div className={"pt-select" + (props.large ? " pt-large" : "") + (props.enabled ? "" : " pt-disabled")}>
				<select value={state.data} onChange={this.handleChange} id={name} disabled={!props.enabled}>
					{children}
				</select>
			</div>
		</label>;
	}
}
