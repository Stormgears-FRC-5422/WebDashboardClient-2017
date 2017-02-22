import Inferno, {linkEvent} from "inferno";
import SyncedComponent from "../../lib/SyncedComponent";

function handleChange(instance, event) {
	instance.setRecord(event.target.value);
}

export default class SyncedRadio extends SyncedComponent {
	name = "SyncedRadio_" + (Math.round(Math.random() * 100000));

	constructor(props) {
		super(props, props.path, "data");

		this.state = {
			data: ""
		};
	}

	componentDidUpdate() {
		// FIXME: This appears to be a bug in Inferno's reconciler
		for (let i = 0; i < this.inputs.length; i++) {
			this.inputs[i].checked = this.state.data === this.inputs[i].value;
		}
	}

	inputs = [];

	inputRef = (i) => {
		return (e) => {
			this.inputs[i] = e;
		}
	};

	render() {
		let buttons = [];
		// TODO: Figure out a cleaner way
		for (let i = 0; i < this.props.children.length; i++) {
			let child = this.props.children[i];

			buttons.push(<label htmlFor={this.name + "_" + i} className="pt-control pt-radio" key={child.props.value}>
				<input ref={this.inputRef(i)} checked={this.state.data === child.props.value} id={this.name + "_" + i} type="radio"
				       value={child.props.value} label={child.props.label} name={this.name} onClick={linkEvent(this, handleChange)} />
				<span className="pt-control-indicator"/>
				{child.props.label}
			</label>);
		}

		return <div>
			<label className="pt-label bold">{this.props.label}</label>
			{buttons}
		</div>;
	}
}
