import Component from "inferno-component";

import Window from "./Window";

export default class Graphs extends Component<any, any> {
	public refs; // ???
	constructor(props) {
		super(props);

		this.state = {
			graphs: {

			}
		};
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
		delete this.state.graphs[path];

		this.setState(this.state);
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
