import Inferno from "inferno";

export default function(props) {
	return props.reverse ? <div className="statistic">
			{props.small}
			<h1>{props.big}</h1>
		</div> : <div className="statistic">
			<h1>{props.big}</h1>
			{props.small}
		</div>
}