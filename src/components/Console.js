/**
 * Created by andrew on 1/14/17.
 */
import React from "react";

export default class Console extends React.Component {
	// constructor(props) {
	// 	super(props);
	// }
	shouldComponentUpdate(nextProps) {
		// optimize performance for large numbers of updates and logs
		if (nextProps.data.length !== this.props.data.length) {
			return true;
		} else {
			return false;
		}
	}
	render() {
		return <pre className="console">
			{
				this.props.data.map(function(row) {
					return <div className="console-row" key={row.key}>
						[{row.timestamp}][{row.type}] {row.log}
					</div>
				})
			}
		</pre>
	}
}