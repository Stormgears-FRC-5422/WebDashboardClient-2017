import Component from "inferno-component";

import {Tooltip} from "@blueprintjs/core/dist/components/tooltip/tooltip";
import {Position} from "@blueprintjs/core/dist/common/position";

export default class ConnectionIndicator extends Component {
	constructor(props) {
		super(props);

		this.state = {
			connected: false
		};
	}

	componentWillMount() {
		global.ds.presence.subscribe((username) => {
			if (username === "robot") {
				global.ds.presence.getAll(this.updatePresence);
			}
		});

		global.ds.presence.getAll(this.updatePresence);
	}

	updatePresence = (clients) => {
		for (let i = 0; i < clients.length; i++) {
			if (clients[i] === "robot") {
				this.setState({
					connected: true
				});
				return;
			}
		}
		this.setState({
			connected: false
		});
	};

	render() {
		return <Tooltip inline={true} position={Position.LEFT} content={this.state.connected ? "Robot connected" : "Robot disconnected"}>
			<button className={"pt-button pt-minimal pt-icon-ring " + (this.state.connected ? "pt-intent-success" : "pt-intent-danger")}/>
		</Tooltip>
	}
}