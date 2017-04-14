// import {NonIdealState} from "@blueprintjs/core/dist/components/non-ideal-state/nonIdealState";
import {Tree} from "@blueprintjs/core/dist/components/tree/tree";
import {ITreeNode} from "@blueprintjs/core/dist/components/tree/treeNode";

import SyncedComponent from "../../lib/SyncedComponent";
import GraphButton from "../GraphButton";
import RecordEditor from "../RecordEditor";

export default class RawData extends SyncedComponent<{}, any> {
	constructor(props) {
		super(props, undefined, "data");

		this.state = {
			data: {},
			expandedNodes: {},
			selectedNode: null
		};
	}

	private createTreeNodes(data: any, path: string = ""): ITreeNode[] {
		const keys: string[] = Object.keys(data);
		const nodes: ITreeNode[] = [];
		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			const d = data[key];

			const node: ITreeNode = {
				id: `${path}.${key}`,
				label: <b>{key}</b>
			};

			node.isSelected = node.id === this.state.selectedNode;

			if (typeof d === "object") {
				node.isExpanded = this.state.expandedNodes.hasOwnProperty(node.id);
				node.secondaryLabel = "Object";
				if (node.isExpanded) {
					node.childNodes = this.createTreeNodes(d, node.id.toString());
				} else {
					node.childNodes = [];
				}
			} else {
				if (typeof d === "number") {
					node.secondaryLabel = <span className="rawdata-editor"><RecordEditor path={node.id.toString().substr(1)}/> <GraphButton path={node.id.toString().substr(1)} /></span>;
				} else {
					node.secondaryLabel = <span className="rawdata-editor"><RecordEditor path={node.id.toString().substr(1)}/></span>;
				}
			}

			nodes.push(node);
		}

		return nodes;
	}

	private handleNodeExpand = (nodeData: ITreeNode) => {
		this.state.expandedNodes[nodeData.id] = true;
		this.setState({
			expandedNodes: this.state.expandedNodes
		});
	}

	private handleNodeCollapse = (nodeData: ITreeNode) => {
		delete this.state.expandedNodes[nodeData.id];
		this.setState({
			expandedNodes: this.state.expandedNodes
		});
	}

	private handleNodeSelect = (nodeData: ITreeNode) => {
		// this.setState({
		// 	selectedNode: nodeData.id === this.state.selectedNode ? null : nodeData.id
		// });
	}

	public render() {
		const {data} = this.state;

		return <div className="rawdata">
			<Tree
				onNodeExpand={this.handleNodeExpand}
				onNodeCollapse={this.handleNodeCollapse}
				onNodeClick={this.handleNodeSelect}
				contents={this.createTreeNodes(data)}
			/>
			<br/>
			<div className="pt-callout">
				Tip: Click on a value to edit.
			</div>
		</div>;
	}
}
