import {findDOMNode} from "inferno";
import Component from "inferno-component";

export default class Console extends Component<any, any> {
	private dLength;
	private shouldScroll = true;
	private node;
	private console;

	constructor(props) {
		super(props);
		this.dLength = props.dataLength;
	}
	public shouldComponentUpdate(nextProps) {
		// console updates manually for performance
		return false;
	}

	public componentDidMount() {
		this.node = findDOMNode(this.console);
	}
	public componentWillReceiveProps(nextProps) {
		if (nextProps.dataLength > this.dLength) {
			for (let i = this.dLength; i < nextProps.dataLength; i++) {
				const row = nextProps.data[i];
				const el = document.createElement("div");
				el.classList.add("console-row");
				let text = "";
				if (row.timestamp) {
					text += `[${row.timestamp}]`;
				}
				if (row.type) {
					const rowType = row.type.toLowerCase();
					if (rowType === "excep" || rowType === "err" || rowType === "stderr") {
						el.classList.add("err");
					}
					text += `[${row.type}]`;
				}
				if (text.length > 0) {
					text += " ";
				}

				el.innerText = `${text}${row.log}`;
				this.node.appendChild(el);
				// this.node.insertBefore(el, this.node.firstChild);
				if (this.shouldScroll) {
					this.node.parentElement.scrollTop = this.node.parentElement.scrollHeight;
				}
			}
		} else if (nextProps.dataLength < this.dLength) {
			// TODO
		}

		this.dLength = nextProps.dataLength;
	}
	public render() {
		const divs = this.props.data.map(function(row) {
			return <div className="console-row" key={row.key}>
				[{row.timestamp}][{row.type}] {row.log}
			</div>;
		});

		return <pre className="console">
			<div className="console-logs" ref={(el) => { this.console = el; }}>{
				divs
			}</div>
		</pre>;
	}
}
