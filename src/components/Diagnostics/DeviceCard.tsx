import Component from "inferno-component";

import {Tree} from "@blueprintjs/core/dist/components/tree/tree";

export default class DeviceCard extends Component<any, any> {
	public refs; // ???
	constructor(props) {
		super(props);
		this.state = {
			propsExpanded: false
		};
	}

	private devTree(dev) {
		if (typeof dev.properties["437321728"] !== "undefined") {
			dev.devID = dev.properties["437321728"].value;

			// move properties to end
			const properties = dev.properties;
			delete dev.properties;
			dev.properties = properties;
		}
		const keys = Object.keys(dev);

		const ret = [];
		for (let i = 0; i < keys.length; i++) {
			const prop = keys[i];

			if (prop === "properties") {
				if (!this.state.propsExpanded) {
					ret.push({
						hasCaret: true,
						label: "Other Properties",
						id: dev.id + "__properties",
						isExpanded: false,
						childNodes: []
					});
					continue;
				}
				const childKeys = Object.keys(dev.properties);
				const childNodes = [];
				for (let i = 0; i < childKeys.length; i++) {
					const property = childKeys[i];
					childNodes.push({
						label: <span>
							<div className="diag-wrap">
								<span className="diag-label">{(+property).toString(16)}</span>
								<span className="diag-num">{dev.properties[property].value}</span>
							</div>
						</span>,
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
					label: <span>
						<div className="diag-wrap">
							<span className="diag-label">{prop}</span>
							<span className="diag-num">{dev[prop]}</span>
						</div>
					</span>,
					id: dev.id + "__" + prop
				});
			}

		}

		return ret;
	}

	private handlePropExpand = () => {
		this.setState({
			propsExpanded: true
		});
	}
	private handlePropCollapse = () => {
		this.setState({
			propsExpanded: false
		});
	}

	public render() {
		const dev = this.props.dev;

		return <div key={dev.id} className="col-xs-6">
			<div className="pt-card" style={{ marginBottom: "1em" }}>
				<h3>{ dev.id }</h3>
				<Tree contents={this.devTree(dev)} onNodeCollapse={this.handlePropCollapse} onNodeExpand={this.handlePropExpand} />
			</div>
		</div>;
	}
}
