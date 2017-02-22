import Inferno from "inferno";
import SyncedComponent from "../../lib/SyncedComponent";
import {NonIdealState} from "@blueprintjs/core";

import GraphButton from "../GraphButton";
// import AHRS3D from "./AHRS3D";

export default class AHRS extends SyncedComponent {
	constructor(props) {
		super(props, "ahrs", "ahrs");
	}

	render() {
		const data = this.state.ahrs;

		if (!data) {
			return <NonIdealState title="No NavX found." visual="warning-sign"/>
		}

		const keys = Object.keys(data);

		if (keys.length === 0) {
			return <NonIdealState title="No NavX found." visual="warning-sign"/>
		}

		let display = [];
		for (let i = 0; i < keys.length; i++) {
			let key = keys[i];
			let val = data[key];

			display.push(<li key={key} className="pt-tree-node">
				<div className="pt-tree-node-content">
					<span className="pt-tree-node-label">
						<div className="diag-wrap">
							<span className="diag-label">
							{ key }
							</span>
							<span className="diag-num">
								{ val.toString() }
								<GraphButton disabled={typeof val !== "number"} path={"ahrs." + key}/>
							</span>
						</div>
				</span>
				</div>
			</li>)
		}

		return <div className="row">
			<div className="col-xs-6">
				<div className="box">
					<div className="pt-card" style={{marginBottom: "1em"}}>
						<div className="pt-tree">
							<ul className="pt-tree-node-list pt-tree-root">
								{ display }
							</ul>
						</div>
					</div>
				</div>
			</div>
			<div className="col-xs-6">
				{/*<AHRS3D {...data} />*/}
			</div>
		</div>
	}
}