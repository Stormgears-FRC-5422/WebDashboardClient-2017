import {EditableText} from "@blueprintjs/core/dist/components/editable-text/editableText";
import Component from "inferno-component";
import _ from "lodash";

function isNumber(o) {
	return !isNaN(o - 0) && o !== null && o !== "" && o !== false;
}

function isBoolean(o) {
	return o === "true" || o === "false";
}

const multiline = /\n/;

export interface RecordEditorProps {
	path: string;
}

interface RecordEditorState {
	contents: string;
	editing: boolean;
}

export default class RecordEditor extends Component<RecordEditorProps, RecordEditorState> {
	private record: deepstreamIO.Record;
	constructor(props) {
		super(props);

		this.state = {
			contents: "",
			editing: false
		};
	}

	public shouldComponentUpdate(nextProps: RecordEditorProps, nextState: RecordEditorState) {
		const {props, state} = this;
		return (state.contents !== nextState.contents) || (state.editing !== nextState.editing) || (props.path !== nextProps.path);
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
			this.record.set(this.props.path, value === "true");
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
		const {state} = this;
		const ml = multiline.test(state.contents);
		if (ml) {
			return <div>{typeof state.contents === "undefined" ? "" : state.contents.toString()}</div>;
		}

		return <EditableText
			value={typeof state.contents === "undefined" ? "" : state.contents.toString()}
			selectAllOnFocus={true}
			onConfirm={this.handleConfirm}
			onEdit={this.handleEdit}
			isEditing={state.editing}
			onCancel={this.handleCancel}
			onChange={this.handleChange}
		/>;
	}
}
