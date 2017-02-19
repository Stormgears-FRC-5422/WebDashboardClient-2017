import Inferno from "inferno";
import Component from "inferno-component";
import {Tree} from "@blueprintjs/core";

export default class deviceCard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			propsExpanded: false
		};
	}

	devTree(dev) {
		if (typeof dev.properties["437321728"] !== "undefined") {
			dev.devID = dev.properties["437321728"].value;

			// move properties to end
			let properties = dev.properties;
			delete dev.properties;
			dev.properties = properties;
		}
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
					isExpanded: this.state.propsExpanded,
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

	handlePropExpand = () => {
		this.setState({
			propsExpanded: true
		});
	};
	handlePropCollapse = () => {
		this.setState({
			propsExpanded: false
		})
	};

	render() {
		let dev = this.props.dev;

		return <div key={dev.id} className="col-xs-6">
			<div className="pt-card" style={{ marginBottom: "1em" }}>
				<h3>{ dev.id }</h3>
				<Tree contents={this.devTree(dev)} onNodeCollapse={this.handlePropCollapse} onNodeExpand={this.handlePropExpand} />
			</div>
		</div>
	}
}