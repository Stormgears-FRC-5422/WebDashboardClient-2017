import SyncedComponent from "../../lib/SyncedComponent";

export default class SyncedDropdown extends SyncedComponent<any, any> {
	constructor(props) {
		super(props, props.path, "data");

		this.state = {
			data: ""
		};
	}

	private handleChange = (event) => {
		this.setRecord(event.target.value);
	}

	public render() {
		return <div className="pt-select">
			<select value={this.state.data} onChange={this.handleChange} id={this.props.id}>
				{ this.props.children }
			</select>
		</div>;
	}
}
