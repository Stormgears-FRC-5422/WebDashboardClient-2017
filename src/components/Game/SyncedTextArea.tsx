import _ from "lodash";

import SyncedComponent from "../../lib/SyncedComponent";

export interface SyncedTextAreaProps {
	label: string;
	path: string;
	large: boolean;
	enabled: boolean;
	fill: boolean;
}

interface SyncedTextAreaState {
	data: string;
	isEditing: boolean;
	editingValue: string;
}

export default class SyncedTextArea extends SyncedComponent<SyncedTextAreaProps, SyncedTextAreaState> {
	private name = "SyncedTextArea_" + (Math.round(Math.random() * 100000));

	constructor(props) {
		super(props, props.path, "data");

		this.state = {
			data: "",
			isEditing: false,
			editingValue: ""
		};
	}

	public shouldComponentUpdate(nP: SyncedTextAreaProps, nS: SyncedTextAreaState) {
		const {props, state} = this;
		return state.data !== nS.data || state.isEditing !== nS.isEditing || state.editingValue !== nS.editingValue || !_.isEqual(nP, props);
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
		this.setRecord(value);
	}

	private handleFocus = () => {
		this.setState({
			isEditing: true,
			editingValue: this.state.data
		});
	}

	private handleBlur = (e) => {
		this.handleConfirm(e.target.value);
	}

	public render() {
		const {props, state} = this;

		return <div>
			<label className="pt-label bold" htmlFor={this.name}>{props.label}</label>
			<textarea
				dir="auto"
				className={"pt-input" + (props.large ? " pt-large" : "") + (props.fill ? " pt-fill" : "")}
				value={state.isEditing ? state.editingValue : state.data}
				disabled={!props.enabled}
				onInput={this.handleChange}
				onFocus={this.handleFocus}
				onBlur={this.handleBlur}
			/>
		</div>;
	}
}
