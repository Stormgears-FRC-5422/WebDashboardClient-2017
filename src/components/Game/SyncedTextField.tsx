import Inferno from "inferno";

import _ from "lodash";

import SyncedComponent from "../../lib/SyncedComponent";

export interface SyncedTextFieldProps {
	label: string;
	path: string;
	large: boolean;
	enabled: boolean;
	fill: boolean;
	numbersOnly: boolean;
}

interface SyncedTextFieldState {
	data: string;
	isEditing: boolean;
	editingValue: string;
}

export default class SyncedTextField extends SyncedComponent<SyncedTextFieldProps, SyncedTextFieldState> {
	private name = "SyncedTextField_" + (Math.round(Math.random() * 100000));

	constructor(props) {
		super(props, props.path, "data");

		this.state = {
			data: "",
			isEditing: false,
			editingValue: ""
		};
	}

	public shouldComponentUpdate(nP: SyncedTextFieldProps, nS: SyncedTextFieldState) {
		const {props, state} = this;
		return state.data !== nS.data || state.isEditing !== nS.isEditing || state.editingValue !== nS.editingValue || _.isEqual(props, nP);
	}

	private handleChange = (e) => {
		const value = e.target.value;

		this.setState({
			editingValue: value
		});
	}

	private handleConfirm = (value: string) => {
		this.setState({
			isEditing: false
		});
		if (this.props.numbersOnly && isNaN(parseFloat(value))) {
			return;
		}
		this.setRecord(value);
	}

	private handleKeyPress = (e) => {
		if (e.keyCode === 13) { // enter key
			this.handleConfirm(e.target.value);
			e.target.blur();
		}
	}

	private handleFocus = () => {
		this.setState({
			isEditing: true,
			editingValue: this.state.data
		});
	}

	private handleBlur = () => {
		this.setState({
			isEditing: false
		});
	}

	public render() {
		const {props, state} = this;

		return <div>
			<label className="pt-label bold" htmlFor={this.name}>{props.label}</label>
			<input
				type="text"
				className={"pt-input" + (props.large ? " pt-large" : "") + (props.fill ? " pt-fill" : "")}
				value={state.isEditing ? state.editingValue : state.data}
				disabled={!props.enabled}
				onInput={this.handleChange}
				onFocus={this.handleFocus}
				onBlur={this.handleBlur}
				onKeyDown={this.handleKeyPress}
			/>
		</div>;
	}
}
