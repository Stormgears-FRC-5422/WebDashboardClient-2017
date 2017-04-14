import {NonIdealState} from "@blueprintjs/core/dist/components/non-ideal-state/nonIdealState";

import SyncedComponent from "../lib/SyncedComponent";
import GraphButton from "./GraphButton";
import RecordEditor from "./RecordEditor";

const blacklist = {
	local: true,
	talons: true,
	devices: true
};

export default class RawData extends SyncedComponent<any, any> {
	constructor(props) {
		super(props, undefined, "data");

		this.state = {
			data: {}
		};
	}

	public render() {
		const {data} = this.state;
		const keys = Object.keys(data);

		const rows = [];
		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];

			if (blacklist[key] !== undefined || typeof data[key] === "object") {
				continue;
			}

			rows.push(<tr key={key}>
				<td><GraphButton disabled={typeof data[key] !== "number"} path={key}/></td>
				<td className="bold">{key}</td>
				<td><RecordEditor path={key}/></td>
			</tr>);
		}

		if (rows.length === 0) {
			return <NonIdealState title="No data." visual="warning-sign" />;
		}

		return <div>
			<table className="pt-table rawdata">
				{rows}
			</table>
			<br/>
			<div className="pt-callout">
				Tip: Click on a value to edit.
			</div>
		</div>;
	}
}
