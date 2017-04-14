function handleClick(path) {
	return function() {
		global["Graphs"].addGraph(path);
	};
}

export default function GraphButton(props) {
	return <button className={"pt-button pt-minimal pt-icon-timeline-line-chart" + (props.disabled ? " pt-disabled" : "")} onClick={props.disabled ? null : handleClick(props.path)}/>
}