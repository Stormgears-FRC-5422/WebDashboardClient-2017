import React from "react";
import {NonIdealState} from "@blueprintjs/core";
import _ from "lodash";

export default class Talons extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = props;

		this.debouncedState = _.debounce((state) => {
			this.setState(state);
		});
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.talons !== this.props.talons) {
			this.debouncedState(nextProps);
		}
	}
	devTree(dev) {
		const keys = Object.keys(dev);

		let ret = [];
		for (let i = 0; i < keys.length; i++) {
			let prop = keys[i];

			ret.push(<li className="pt-tree-node">
				<div className="pt-tree-node-content">
					<span className="pt-tree-node-caret-none pt-icon-standard"/>
					<span className="pt-tree-node-label">
						<span className="diag-label">
							{ prop }
						</span>
						<span className="diag-num">
							{ dev[prop] }
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
	render() {
		let talons = this.state.talons;

		if (!talons || talons.length === 0) {
			return <NonIdealState title="No motors found." visual="warning-sign" />
		}

		let cards = [];
		for (let i = 0; i < talons.length; i++) {
			let dev = talons[i];
			cards.push(<div key={i} className="col-xs-6">
				<div className="pt-card" style={{ marginBottom: "1em" }}>
					{this.devTree(dev)}
				</div>
			</div>);
		}

		return <div className="row">
			{cards}
		</div>
	}
}