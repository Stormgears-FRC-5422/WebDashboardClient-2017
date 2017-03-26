import {linkEvent} from "inferno";
import SyncedComponent from "../../lib/SyncedComponent";

function handleChange(instance, event) {
	instance.setRecord(event.target.value);
}

export default class SyncedDropdown extends SyncedComponent {
	constructor(props) {
		super(props, props.path, "data");

		this.state = {
			data: ""
		};
	}

	render() {
		return <div className="pt-select">
			<select value={this.state.data} onChange={linkEvent(this, handleChange)} id={this.props.id}>
				{ this.props.children }
			</select>
		</div>;
	}
}
