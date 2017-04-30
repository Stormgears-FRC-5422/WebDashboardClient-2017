import Inferno from "inferno";

import {NonIdealState} from "@blueprintjs/core/dist/components/non-ideal-state/nonIdealState";
import Component from "inferno-component";

import SyncedComponent from "../../lib/SyncedComponent";
import GraphButton from "../GraphButton";
// import AHRS3D from "./AHRS3D";

class NavXNode extends Component<{ key1: string, val: any }, {}> {
	public shouldComponentUpdate(nP) {
		const props = this.props;
		return props.key1 !== nP.key1 || props.val !== nP.val;
	}

	public render() {
		const {key1, val} = this.props;
		return <li key={key1} className="pt-tree-node">
			<div className="pt-tree-node-content">
					<span className="pt-tree-node-label">
						<div className="diag-wrap">
							<span className="diag-label">
							{ key1 }
							</span>
							<span className="diag-num">
								{ val.toString() }
								<GraphButton disabled={typeof val !== "number"} path={"diagnostics/ahrs." + key1}/>
							</span>
						</div>
				</span>
			</div>
		</li>;
	}
}

export default class AHRS extends SyncedComponent<{}, any> {
	constructor(props) {
		super(props, "ahrs", "ahrs", "diagnostics");

		this.state = {};
	}

	public render() {
		const data = this.state.ahrs;

		if (!data) {
			return <NonIdealState title="No NavX found." visual="warning-sign"/>;
		}

		const keys = Object.keys(data);

		if (keys.length === 0) {
			return <NonIdealState title="No NavX found." visual="warning-sign"/>;
		}

		const display = [];
		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			const val = data[key];

			display.push(<NavXNode key={key} key1={key} val={val}/>);
		}

		return <div className="row">
			<div className="col-xs-6">
				<div className="box">
					<div className="pt-card" style={{marginBottom: "1em"}}>
						<div className="pt-tree">
							<ul className="pt-tree-node-list pt-tree-root" hasKeyedChildren>
								{ display }
							</ul>
						</div>
					</div>
				</div>
			</div>
			<div className="col-xs-6">
				{/*<AHRS3D {...data} />*/}
			</div>
		</div>;
	}
}
