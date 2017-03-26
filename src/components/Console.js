import {findDOMNode} from "inferno";
import Component from "inferno-component";

export default class Console extends Component {
	constructor(props) {
		super(props);
		this.dLength = props.dataLength;
		this.shouldScroll = true;
	}
	shouldComponentUpdate(nextProps) {
		// console updates manually for performance
		return false;
	}

	componentDidMount() {
		this.node = findDOMNode(this.console);
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.dataLength > this.dLength) {
			for (let i = this.dLength; i < nextProps.dataLength; i++) {
				let row = nextProps.data[i];
				let el = document.createElement("div");
				el.classList.add("console-row");
				let rowType = row.type.toLowerCase();
				if (rowType === "excep" || rowType === "err" || rowType === "stderr") {
					el.classList.add("err");
				}
				el.innerText = `[${row.timestamp}][${row.type}] ${row.log}`;
				this.node.appendChild(el);
				// this.node.insertBefore(el, this.node.firstChild);
				if (this.shouldScroll) {
					this.node.parentElement.scrollTop = this.node.parentElement.scrollHeight
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
		</pre>;
	}
}