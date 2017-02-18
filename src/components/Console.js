/**
 * Created by andrew on 1/14/17.
 */
import React from "react";
import ReactDOM from "react-dom";

import _ from "lodash";

export default class Console extends React.Component {
	constructor(props) {
		super(props);
		this.dLength = props.dataLength;
		this.shouldScroll = true;
	}
	shouldComponentUpdate(nextProps) {
		// optimize performance for large numbers of updates and logs
		// if (nextProps.dataLength !== this.props.dataLength) {
		// 	return true;
		// } else {
		// 	return false;
		// }
		return false;
	}
	// componentDidUpdate() {
	// 	let node = ReactDOM.findDOMNode(this.end);
	// 	node.scrollIntoView({
	// 		behavior: "smooth"
	// 	});
	// }
	//
	componentDidMount() {
		this.node = ReactDOM.findDOMNode(this.console);
		this.end = ReactDOM.findDOMNode(this.end);
	}
	componentWillReceiveProps(nextProps) {
		// let willScroll = false;
		// if (this.node.scrollTop === (this.node.scrollHeight - this.node.offsetHeight)) {
		// 	willScroll = true;
		// }
		if (nextProps.dataLength > this.dLength) {
			for (let i = this.dLength; i < nextProps.dataLength; i++) {
				let row = nextProps.data[i];
				let el = document.createElement("div");
				el.classList.add("console-row");
				if (row.type.toLowerCase() === "excep" || row.type.toLowerCase() === "err") {
					el.classList.add("err");
				}
				el.innerText = `[${row.timestamp}][${row.type}] ${row.log}`;
				this.node.appendChild(el);
				// this.node.insertBefore(el, this.node.firstChild);
				if (this.shouldScroll) {
					this.end.scrollIntoView({
						behavior: "smooth"
					});
				}
			}
		} else if (nextProps.dataLength < this.dLength) {
			// TODO
		}



		this.dLength = nextProps.dataLength;
	}
	render() {
		let divs = this.props.data.map(function(row) {
			return <div className="console-row" key={row.key}>
				[{row.timestamp}][{row.type}] {row.log}
			</div>
		});
		return <pre className="console">
			<div className="console-logs" ref={el => { this.console = el }}>{
				divs
			}</div>
			<div ref={el => { this.end = el }}></div>
		</pre>
		// return <pre className="console" ref={el => { this.console = el }}>
		// 	<div className="console-end" ref={el => { this.end = el }}></div>
		// </pre>
	}
}