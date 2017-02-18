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
		return Object.keys(dev).map(prop => {
			if (prop === "properties") {
				return {
					hasCaret: true,
					label: "Other Properties",
					id: dev.id + "__properties",
					isExpanded: this.state.expandedDeviceProps[dev.id + "__properties"],
					childNodes: Object.keys(dev.properties).map(property => {
						return {
							label: property.toString(16) + ": " + dev.properties[property].value,
							id: dev.id + "__properties__" + property
						}
					})
				};
			} else {
				return {
					hasCaret: false,
					label: prop + ": " + dev[prop],
					id: dev.id + "__" + prop
				};
			}
		});
	}
	render() {
		let devices = this.props.devices;

		if (!devices || devices.length === 0) {
			return <NonIdealState title="No devices found." visual="warning-sign" />
		}

		return <div className="row">
			{
				devices.map(dev => {
					return <div key={dev.id} className="col-xs-6">
						<div className="pt-card" style={{ marginBottom: "1em" }}>
							<h3>{ dev.id }</h3>
							<Tree contents={this.devTree(dev)} onNodeCollapse={this.handleDevPropCollapse} onNodeExpand={this.handleDevPropExpand} />
						</div>
					</div>
				})
			}
		</div>
	}
}