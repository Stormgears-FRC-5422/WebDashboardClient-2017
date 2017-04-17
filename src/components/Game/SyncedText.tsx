import SyncedComponent from "../../lib/SyncedComponent";

import {EditableText} from "@blueprintjs/core/dist/components/editable-text/editableText";

export interface SyncedTextProps {
	label: string;
	path: string;
	large: boolean;
	editable: boolean;
	numbersOnly: boolean;
}

interface SyncedTextState {
	data: string;
	isEditing: boolean;
	editingValue: string;
}

export default class SyncedProgress extends SyncedComponent<SyncedTextProps, SyncedTextState> {
	constructor(props) {
		super(props, props.path, "data");

		this.state = {
			data: "",
			isEditing: false,
			editingValue: ""
		};
	}

	private handleChange = (value: string) => {
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

	private handleEdit = () => {
		this.setState({
			isEditing: true,
			editingValue: this.state.data
		});
	}

	public render() {
		const {props, state} = this;

		const Wrapper = this.props.large ? "h1" : "div";

		return <div>
			<label className="pt-label bold">{props.label}</label>
			<Wrapper>
				<EditableText
					disabled={!props.editable}
					value={state.isEditing ? state.editingValue : state.data}
					isEditing={state.isEditing}
					placeholder="Click to edit..."
					onChange={this.handleChange}
					onConfirm={this.handleConfirm}
					onEdit={this.handleEdit}
					selectAllOnFocus
				/>
			</Wrapper>
		</div>;
	}
}
