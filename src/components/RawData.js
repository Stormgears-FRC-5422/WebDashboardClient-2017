import Inferno from "inferno";
import {NonIdealState} from "@blueprintjs/core";

import RecordEditor from "./RecordEditor";

const blacklist = {
	"local": true,
	"talons": true,
	"devices": true
};

export default function RawData(props) {
	const {data} = props;
	const keys = Object.keys(data);

	const rows = [];
	for (let i = 0; i < keys.length; i++) {
		let key = keys[i];

		if (blacklist[key] !== undefined) {
			continue;
		}

		rows.push(<tr key={key}>
			<td className="bold">{key}</td>
			<td><RecordEditor path={key}/></td>
		</tr>);
	}

	if (rows.length === 0) {
		return <NonIdealState title="No data." visual="warning-sign" />;
	}

	return <div>
		<table className="pt-table">
			{rows}
		</table>
		<br/>
		<div className="pt-callout">
			Tip: Click on a value to edit.
		</div>
	</div>
}