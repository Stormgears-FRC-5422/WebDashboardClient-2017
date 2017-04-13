import {NonIdealState} from "@blueprintjs/core/dist/components/non-ideal-state/nonIdealState";

import SyncedComponent from "../../lib/SyncedComponent";
import GraphButton from "../GraphButton";

// yes I know these are terrible icons
const icons = {
	deviceID: "numerical",
	controlMode: "repeat",
	getValue: "circle",
	busVoltage: "offline",
	outputVoltage: "offline",
	outputCurrent: "flash",
	encPosition: "arrow-down",
	position: "arrow-down",
	encVelocity: "double-chevron-right",
	speed: "double-chevron-right",
	temperature: "heatmap"
};

function devTree(dev, talonPath) {
	const keys = Object.keys(dev);

	const ret = [];
	for (let i = 0; i < keys.length; i++) {
		const prop = keys[i];

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

		const icon = icons[prop] || "standard";

		ret.push(<li key={prop} className="pt-tree-node">
			<div className="pt-tree-node-content">
				<span className={"pt-tree-node-caret-none pt-icon-" + icon}/>
				<span className="pt-tree-node-label">
						<div className="diag-wrap">
							<span className="diag-label">
							{ prop }
							</span>
							<span className="diag-num">
								{ num }
								<GraphButton disabled={typeof num !== "number"} path={"diagnostics/" + talonPath + "." + prop}/>
							</span>
						</div>
				</span>
			</div>
		</li>);
	}
	return <div className="pt-tree">
		<ul className="pt-tree-node-list pt-tree-root">
			{ ret }
		</ul>
	</div>;
}

export default class Talons extends SyncedComponent<any, any> {
	public refs; // ???
	constructor(props) {
		super(props, "talons", "talons", "diagnostics");
		this.state = {
			talons: []
		};
	}

	public render() {
		const talons = this.state.talons;

		if (!talons || talons.length === 0) {
			return <NonIdealState title="No motors found." visual="warning-sign" />;
		}

		const cards = [];
		for (let i = 0; i < talons.length; i++) {
			const dev = talons[i];
			cards.push(<div key={i} className="col-xs-6">
				<div className="pt-card" style={{ marginBottom: "1em" }}>
					{devTree(dev, `talons[${i}]`)}
				</div>
			</div>);
		}

		return <div className="row">
			{cards}
		</div>;
	}
}