import Inferno, {linkEvent} from "inferno";

function handleClick(props) {
	global.Graphs.addGraph(props.path);
}

export default function GraphButton(props) {
	return <button className={"pt-button pt-minimal pt-icon-timeline-line-chart" + (props.disabled ? " pt-disabled" : "")} onClick={linkEvent(props, handleClick)}/>
}