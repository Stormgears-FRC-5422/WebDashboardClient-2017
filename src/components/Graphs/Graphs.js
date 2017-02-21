import Inferno from "inferno";
import Component from "inferno-component";

import Window from "./Window";

export default class Graphs extends Component {
	constructor(props) {
		super(props);

		this.state = {
			graphs: {

			}
		};
	}

	componentWillMount() {
		global.Graphs = this;
	}

	//noinspection JSMethodCanBeStatic
	componentWillUnmount() {
		delete global.Graphs;
	}

	addGraph = (path) => {
		this.setState({
			graphs: {
				...this.state.graphs,
				[path]: true
			}
		});
	};

	delGraph = (path) => {
		delete this.state.graphs[path];

		this.setState(this.state);
	};

	render() {
		let graphs = this.state.graphs;
		let keys = Object.keys(graphs);

		let windows = [];
		for (let i = 0; i < keys.length; i++) {
			windows.push(<Window key={keys[i]} path={keys[i]}/>)
		}

		return <div>{windows}</div>
	}
}