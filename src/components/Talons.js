import React from "react";
import {Tree, NonIdealState} from "@blueprintjs/core";
export default class Talons extends React.PureComponent {
	devTree(dev) {
		return Object.keys(dev).map(prop => {
			return {
				hasCaret: false,
				label: prop + ": " + dev[prop],
				id: dev.id + "__" + prop
			};
		});
	}
	render() {
		let talons = this.props.talons;

		if (!talons || talons.length === 0) {
			return <NonIdealState title="No motors found." visual="warning-sign" />
		}

		return <div className="row">
			{
				talons.map((dev, i) => {
					return <div key={i} className="col-xs-6">
						<div className="pt-card" style={{ marginBottom: "1em" }}>
							<Tree contents={this.devTree(dev)} />
						</div>
					</div>
				})
			}
		</div>
	}
}