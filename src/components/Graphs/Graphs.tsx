import Inferno from "inferno";
import Component from "inferno-component";
import _ from "lodash";

import Window from "./Window";

interface GraphsState {
	graphs: any;
}

export default class Graphs extends Component<{}, GraphsState> {
	constructor(props) {
		super(props);

		this.state = {
			graphs: {

			}
		};
	}

	public shouldComponentUpdate(nP: {}, nS: GraphsState) {
		return this.state.graphs !== nS.graphs;
	}

	public componentWillMount() {
		global["Graphs"] = this;
	}

	//noinspection JSMethodCanBeStatic
	public componentWillUnmount() {
		delete global["Graphs"];
	}

	public addGraph = (path) => {
		this.setState({
			graphs: {
				...this.state.graphs,
				[path]: true
			}
		});
	}

	public delGraph = (path) => {
		this.setState({
			graphs: _.omit(this.state.graphs, path)
		});
	}

	public render() {
		const graphs = this.state.graphs;
		const keys = Object.keys(graphs);

		const windows = [];
		for (let i = 0; i < keys.length; i++) {
			windows.push(<Window key={keys[i]} path={keys[i]}/>);
		}

		return <div>{windows}</div>;
	}
}
