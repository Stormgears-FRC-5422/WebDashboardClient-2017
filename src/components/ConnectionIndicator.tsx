import Inferno from "inferno";
import Component from "inferno-component";

import {Position} from "@blueprintjs/core/dist/common/position";
import {Tooltip} from "@blueprintjs/core/dist/components/tooltip/tooltip";

interface ConnectionIndicatorState {
	connected: boolean;
}

export default class ConnectionIndicator extends Component<{}, ConnectionIndicatorState> {
	constructor(props) {
		super(props);

		this.state = {
			connected: false
		};
	}

	public shouldComponentUpdate(nP: {}, nS: ConnectionIndicatorState) {
		return this.state.connected !== nS.connected;
	}

	public componentWillMount() {
		global.ds.presence.subscribe((username) => {
			if (username === "robot") {
				global.ds.presence.getAll(this.updatePresence);
			}
		});

		global.ds.presence.getAll(this.updatePresence);
	}

	private updatePresence = (clients) => {
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
	}

	public render() {
		return <Tooltip inline={true} position={Position.LEFT} content={this.state.connected ? "Robot connected" : "Robot disconnected"}>
			<button className={"pt-button pt-minimal pt-icon-ring " + (this.state.connected ? "pt-intent-success" : "pt-intent-danger")}/>
		</Tooltip>;
	}
}
