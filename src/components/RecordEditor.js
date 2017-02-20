import Inferno from "inferno";
import Component from "inferno-component";
import {EditableText} from "@blueprintjs/core";

function isNumber(o) {
	return !isNaN(o - 0) && o !== null && o !== "" && o !== false;
}

function isBoolean(o) {
	return o === 'true' || o === 'false';
}

export default class RecordEditor extends Component {
	constructor(props) {
		super(props);

		this.state = {
			contents: "",
			editing: false
		};
	}

	componentWillMount() {
		this.record = global.ds.record.getRecord("webdashboard");
		this.record.subscribe(this.props.path, this.handleRecordChange);
		this.setState({
			contents: this.record.get(this.props.path)
		});
	}

	componentWillUnmount() {
		this.record.unsubscribe(this.handleRecordChange);
	}

	handleRecordChange = (data) => {
		if (!this.state.editing) {
			this.setState({
				contents: data
			});
		}
	};

	handleConfirm = (value) => {
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
	};

	handleEdit = () => {
		this.setState({
			editing: true
		});
	};

	handleCancel = () => {
		this.setState({
			editing: false,
			contents: this.record.get(this.props.path)
		});
	};

	handleChange = (d) => {
		this.setState({
			contents: d
		});
	};

	render() {
		return <EditableText
			value={this.state.contents}
			selectAllOnFocus={true}
			onConfirm={this.handleConfirm}
			onEdit={this.handleEdit}
			isEditing={this.state.editing}
			onCancel={this.handleCancel}
		    onChange={this.handleChange}
		/>
	}
}