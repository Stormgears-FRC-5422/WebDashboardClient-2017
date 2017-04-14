import {EditableText} from "@blueprintjs/core/dist/components/editable-text/editableText";
import Component from "inferno-component";
import _ from "lodash";

function isNumber(o) {
	return !isNaN(o - 0) && o !== null && o !== "" && o !== false;
}

function isBoolean(o) {
	return o === "true" || o === "false";
}

export default class RecordEditor extends Component<any, any> {
	private record: deepstreamIO.Record;
	constructor(props) {
		super(props);

		this.state = {
			contents: "",
			editing: false
		};
	}

	public componentWillMount() {
		this.record = global.ds.record.getRecord("webdashboard");
		this.record.subscribe(this.props.path, this.handleRecordChange);
		this.setState({
			contents: this.record.get(this.props.path)
		});
	}

	public componentWillUnmount() {
		this.record.unsubscribe(this.handleRecordChange);
	}

	private handleRecordChange = _.debounce((data) => {
		if (!this.state.editing) {
			this.setState({
				contents: data
			});
		}
	}, 1000 / 60, {
		leading: true,
		trailing: true
	});

	private handleConfirm = (value) => {
		let a;
		if (isNumber(value)) {
			this.record.set(this.props.path, +value);
			a = +value;
		} else if (isBoolean(value)) {
			this.record.set(this.props.path, Boolean(value));
			a = Boolean(value);
		} else {
			this.record.set(this.props.path, value);
			a = value;
		}

		this.setState({
			contents: a,
			editing: false
		});
	}

	private handleEdit = () => {
		this.setState({
			editing: true
		});
	}

	private handleCancel = () => {
		this.setState({
			editing: false,
			contents: this.record.get(this.props.path)
		});
	}

	private handleChange = (d) => {
		this.setState({
			contents: d
		});
	}

	public render() {
		return <EditableText
			value={this.state.contents}
			selectAllOnFocus={true}
			onConfirm={this.handleConfirm}
			onEdit={this.handleEdit}
			isEditing={this.state.editing}
			onCancel={this.handleCancel}
			onChange={this.handleChange}
		/>;
	}
}
