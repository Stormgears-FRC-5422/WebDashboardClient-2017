import React from "react";
import {Tree, NonIdealState} from "@blueprintjs/core";
export default class Talons extends React.PureComponent {
	devTree(dev) {
		const keys = Object.keys(dev);

		let ret = [];
		for (let i = 0; i < keys.length; i++) {
			let prop = keys[i];
			ret.push({
				hasCaret: false,
				label: prop + ": " + dev[prop],
				id: dev.id + "__" + prop
			});
		}
		return ret;
	}
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
					<Tree contents={this.devTree(dev)} />
				</div>
			</div>);
		}

		return <div className="row">
			{cards}
		</div>
	}
}