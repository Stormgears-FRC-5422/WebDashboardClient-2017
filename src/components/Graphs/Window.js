import Inferno, {linkEvent} from "inferno";
import Component from "inferno-component";

import {Tooltip, Position} from "@blueprintjs/core";
import Portal from "react-portal";
import Draggable from "react-draggable";
import {ResizableBox} from "react-resizable";
import {XYPlot, XAxis, YAxis, HorizontalGridLines, VerticalGridLines, LineSeries, Hint} from "react-vis";


function zeroPad(n) {
    if (n < 10) {
        return "0" + n;
    } else {
        return n;
    }
}
function graphDate(date) {
    if (date.getMilliseconds() !== 0) {
        return `:${zeroPad(date.getMinutes())}:${zeroPad(date.getSeconds())}.${date.getMilliseconds()}`;
    }
    return `${zeroPad(date.getHours())}:${zeroPad(date.getMinutes())}:${zeroPad(date.getSeconds())}`;
}
function hintDate(d) {
    return `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}.${d.getMilliseconds()}`
}

// Ugly hack for Inferno compatibility
Object.defineProperty(MouseEvent.prototype, "nativeEvent", {
    get: function () {
        return this;
    }
});

function handleClose(instance) {
    global.Graphs.delGraph(instance.props.path);
}
function handleClear(instance) {
    instance.state.data.length = 0;
    instance.setState({
        data: []
    });
}
function handleDomain(instance) {
    instance.setState({
        limitDomain: !instance.state.limitDomain
    });
}
export default class Window extends Component {
    subRecord;
    path;

    constructor(props) {
        super(props);

        let splitPath = props.path.split("/");
        if (splitPath.length === 1) {
            this.subRecord = null;
            this.path = splitPath[0];
        } else {
            this.subRecord = splitPath[0];
            this.path = splitPath[1];
        }

        this.state = {
            data: [],
            hover: null,
            width: 400,
            height: 280,
            lineHue: Math.floor(Math.random() * 360),
            limitDomain: false
        };
    }

    lastUpdate = new Date();

    componentWillMount() {
        this.record = global.ds.record.getRecord(this.subRecord ? "webdashboard/" + this.subRecord : "webdashboard");
        this.record.subscribe(this.path, this.handleData, true);

        this.poller = setInterval(() => {
            if (Date.now() - this.lastUpdate.getTime() < 500) {
                return;
            }
            this.handleData(this.record.get(this.path), true);
        }, 500);
    }

    componentWillUnmount() {
        clearInterval(this.poller);
        this.record.unsubscribe(this.handleData);
        this.record.discard();
    }

    handleData = (data, fake) => {
        let d = new Date();
        this.state.data.push({
            x: d,
            y: data
        });
        this.setState(data);

        if (!fake) {
            this.lastUpdate = d;
        }
    };

    handleResize = (e, {element, size}) => {
        const {width, height} = size;

        this.setState({width, height});
    };

    handleHoverNear = (v, i) => {
        if (!this.state.hover || v.x.getTime() !== this.state.hover.x.getTime()) {
            this.setState({
                hover: v
            });
        }
    };

    handleHoverOut = () => {
        console.log();
        this.setState({
            hover: null
        });
    };

    render() {
        let lastPointX = (this.state.data[this.state.data.length - 1] || {x: new Date()}).x.getTime();
        let plot = (<XYPlot
            width={this.state.width - 10}
            height={this.state.height - 50}
            xType="time"
            onMouseLeave={this.handleHoverOut}
            xDomain={this.state.limitDomain ? [lastPointX - 10000, lastPointX] : undefined}
        >
            <VerticalGridLines />
            <HorizontalGridLines />
            <LineSeries
                color={"hsl(" + this.state.lineHue + ",75%,50%)"}
                data={this.state.data}
                onNearestX={this.handleHoverNear}
            />
            <XAxis title="Time" tickFormat={graphDate} tickLabelAngle={30} height={80}/>
            <YAxis title={this.props.path}/>
        </XYPlot>);

        let hov = this.state.hover;
        if (hov) {
            plot.props.children.push(<Hint value={hov}>
                <div className="rv-hint__content">
                    <div>
                        <span className="rv-hint__title">Time</span>
                        {': '}
                        <span className="rv-hint__value">{hintDate(hov.x)}</span>
                    </div>
                    <div>
                        <span className="rv-hint__title">{this.props.path}</span>
                        {': '}
                        <span className="rv-hint__value">{hov.y}</span>
                    </div>
                </div>
            </Hint>)
        }

        return <Portal isOpened={true}>
            <Draggable handle=".pt-dialog-header">
                <div className="graphwindow">
                    <ResizableBox width={400} height={280} onResize={this.handleResize} minConstraints={[200, 150]}>
                        <div className="pt-dialog">
                            <div className="pt-dialog-header graphwindow-handle">
                                <h5>{this.props.path}</h5>
                                <Tooltip inline={true} position={Position.BOTTOM}
                                         content={this.state.limitDomain ? "Displaying last 10 seconds of data" : "Displaying all data"}>
                                    <button
                                        className={"pt-button pt-minimal pt-icon-arrows-horizontal" + (this.state.limitDomain ? " pt-active" : "")}
                                        onClick={linkEvent(this, handleDomain)}/>
                                </Tooltip>
                                <Tooltip inline={true} position={Position.BOTTOM} content="Clear Data">
                                    <button className="pt-button pt-minimal pt-icon-trash"
                                            onClick={linkEvent(this, handleClear)}/>
                                </Tooltip>
                                <button aria-label="Close" class="pt-dialog-close-button pt-icon-small-cross"
                                        onClick={linkEvent(this, handleClose)}/>
                            </div>
                            <div className="pt-dialog-body">
                                {plot}
                            </div>
                        </div>
                    </ResizableBox>
                </div>
            </Draggable>
        </Portal>
    }
}