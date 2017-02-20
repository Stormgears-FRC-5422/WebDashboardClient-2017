import Inferno from "inferno";
import Component from "inferno-component";
import {NonIdealState} from "@blueprintjs/core";
import _ from "lodash";

function devTree(dev) {
	const keys = Object.keys(dev);

	let ret = [];
	for (let i = 0; i < keys.length; i++) {
		let prop = keys[i];

		let num = dev[prop];
		switch (prop) {
			case "temperature":
				num = Math.round(num * 10) / 10;
				break;
			case "busVoltage":
				num = Math.round(num * 1000) / 1000;
				break;
			default:

		}

		ret.push(<li key={prop} className="pt-tree-node">
			<div className="pt-tree-node-content">
				<span className="pt-tree-node-caret-none pt-icon-standard"/>
				<span className="pt-tree-node-label">
						<span className="diag-label">
							{ prop }
						</span>
						<span className="diag-num">
							{ num }
						</span>
					</span>
			</div>
		</li>)
	}
	return <div className="pt-tree">
		<ul className="pt-tree-node-list pt-tree-root">
			{ ret }
		</ul>
	</div>
}

export default class Talons extends Component {
	render() {
		let talons = this.props.talons;

		if (!talons || talons.length === 0) {
			return <NonIdealState title="No motors found." visual="warning-sign" />
		}

		let cards = [];
		for (let i = 0; i < talons.length; i++) {
			let dev = talons[i];
			cards.push(<div key={i} className="col-xs-6">
				<div className="pt-card" style={{ marginBottom: "1em" }}>
					{devTree(dev)}
				</div>
			</div>);
		}

		return <div className="row">
			{cards}
		</div>
	}
}