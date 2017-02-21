import Inferno, {linkEvent} from "inferno";
import Component from "inferno-component";

import Portal from "react-portal";
import Draggable from "react-draggable";
import {ResizableBox} from "react-resizable";
import {XYPlot, XAxis, YAxis, HorizontalGridLines, VerticalGridLines, LineSeries} from "react-vis";

function handleClose(instance) {
	global.Graphs.delGraph(instance.props.path);
}


function zeroPad(n) {
	if (n < 10) {
		return "0" + n;
	} else {
		return n;
	}
}
function graphDate(date) {
	if (date.getMilliseconds() != 0) {
		return `:${zeroPad(date.getMinutes())}:${zeroPad(date.getSeconds())}.${date.getMilliseconds()}`;
	}
	return `${zeroPad(date.getHours())}:${zeroPad(date.getMinutes())}:${zeroPad(date.getSeconds())}`;
}

export default class Window extends Component {
	constructor(props) {
		super(props);

		this.state = {
			data: [],
			width: 400,
			height: 280
		};
	}

	componentWillMount() {
		this.record = global.ds.record.getRecord("webdashboard");
		this.record.subscribe(this.props.path, this.handleData, true);
	}

	handleData = (data) => {
		let d = new Date();
		this.state.data.push({
			x: d,
			y: data
		});
		this.setState(data);
	};

	handleResize = (e, {element, size}) => {
		const {width, height} = size;

		this.setState({ width, height });
	};

	render() {
		return <Portal isOpened={true}>
			<Draggable handle=".pt-dialog-header">
				<div className="graphwindow">
					<ResizableBox width={400} height={280} onResize={this.handleResize} minConstraints={[200, 150]}>
						<div className="pt-dialog">
							<div className="pt-dialog-header graphwindow-handle">
								<h5>{this.props.path}</h5>
								<button aria-label="Close" class="pt-dialog-close-button pt-icon-small-cross" onClick={linkEvent(this, handleClose)}/>
							</div>
							<div className="pt-dialog-body">
								<XYPlot
									width={this.state.width - 10}
									height={this.state.height - 50}
								    xType="time"
								>
									<VerticalGridLines />
									<HorizontalGridLines />
									<LineSeries
										data={this.state.data}/>
									<XAxis title="Time" tickFormat={graphDate} tickLabelAngle={30} height={80} />
									<YAxis title={this.props.path} />
								</XYPlot>
							</div>
						</div>
					</ResizableBox>
				</div>
			</Draggable>
		</Portal>
	}
}