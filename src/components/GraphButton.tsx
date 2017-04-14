export interface GraphButtonProps {
	disabled: boolean;
	path: string;
}

function handleClick(path: string) {
	return function() {
		global["Graphs"].addGraph(path);
	};
}

export default function GraphButton(props: GraphButtonProps) {
	return <button className={"pt-button pt-minimal pt-icon-timeline-line-chart" + (props.disabled ? " pt-disabled" : "")} onClick={props.disabled ? null : handleClick(props.path)}/>
}