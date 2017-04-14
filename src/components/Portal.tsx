import {render, VNode} from "inferno";
import Component from "inferno-component";

// TODO: Move into own package
// Based on https://github.com/developit/preact-portal
export default class Portal extends Component<any, any> {
	public remote;
	public intoPointer;
	public into;
	public refs; // ???

	public componentDidUpdate(props) {
		for (const i in props) {
			if (props[i] !== this.props[i]) {
				return this.renderLayer();
			}
		}
	}

	public componentDidMount() {
		this.renderLayer();
	}

	public componentWillUnmount() {
		this.renderLayer(false);
		if (this.remote) {
			this.remote.parentNode.removeChild(this.remote);
		}
	}

	public findNode(node) {
		return typeof node === "string" ? document.querySelector(node) : node;
	}

	public renderLayer(show = true) {
		// clean up old node if moving bases:
		if (this.props.into !== this.intoPointer) {
			this.intoPointer = this.props.into;
			if (this.into && this.remote) {
				this.remote = render(<PortalProxy /> as VNode, this.into/*, this.remote*/);
			}
			this.into = this.findNode(this.props.into);
		}

		this.remote = render((
			<PortalProxy context={this.context}>
				{ show && this.props.children || null }
			</PortalProxy> as VNode
		), this.into/*, this.remote*/);
	}

	public render() {
		return null;
	}
}

// high-order component that renders its first child if it exists.
// used as a conditional rendering proxy.
class PortalProxy extends Component<any, any> {
	public refs; // ???
	public getChildContext() {
		return this.props.context;
	}
	public render() {
		const { children } = this.props;

		return children && children[0] || null;
	}
}
