import React from "react";
import {Tree, NonIdealState} from "@blueprintjs/core";

export default class Devices extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			expandedDeviceProps: {

			}
		}
	}
	handleDevPropExpand = (nodeData) => {
		this.setState({
			expandedDeviceProps: {
				[nodeData.id]: true
			}
		})
	};
	handleDevPropCollapse = (nodeData) => {
		this.setState({
			expandedDeviceProps: {
				[nodeData.id]: false
			}
		})
	};
	devTree(dev) {
		const keys = Object.keys(dev);

		let ret = [];
		for (let i = 0; i < keys.length; i++) {
			let prop = keys[i];

			if (prop === "properties") {
				let childKeys = Object.keys(dev.properties);
				let childNodes = [];
				for (let i = 0; i < childKeys.length; i++) {
					let property = childKeys[i];
					childNodes.push({
						label: property.toString(16) + ": " + dev.properties[property].value,
						id: dev.id + "__properties__" + property
					});
				}

				ret.push({
					hasCaret: true,
					label: "Other Properties",
					id: dev.id + "__properties",
					isExpanded: this.state.expandedDeviceProps[dev.id + "__properties"],
					childNodes
				});
			} else {
				ret.push({
					hasCaret: false,
					label: prop + ": " + dev[prop],
					id: dev.id + "__" + prop
				});
			}

		}

		return ret;
	}
	render() {
		let devices = this.props.devices;

		if (!devices || devices.length === 0) {
			return <NonIdealState title="No devices found." visual="warning-sign" />
		}

		let devCards = [];
		for (let i = 0; i < devices.length; i++) {
			let dev = devices[i];
			devCards.push(<div key={dev.id} className="col-xs-6">
				<div className="pt-card" style={{ marginBottom: "1em" }}>
					<h3>{ dev.id }</h3>
					<Tree contents={this.devTree(dev)} onNodeCollapse={this.handleDevPropCollapse} onNodeExpand={this.handleDevPropExpand} />
				</div>
			</div>);
		}

		return <div className="row">
			{devCards}
		</div>
	}
}