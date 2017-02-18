import React from "react";
import {Tree} from "@blueprintjs/core";
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