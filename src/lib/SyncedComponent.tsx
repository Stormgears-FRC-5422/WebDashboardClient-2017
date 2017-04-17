import Component from "inferno-component";
import _ from "lodash";

export default class SyncedComponent<P, S> extends Component<P, S> {
	protected path: string;
	private stateKey: string;
	private dsRecord: deepstreamIO.Record;

	constructor(props: P, path: string, stateKey: string, subRecord?: string) {
		super(props);

		this.path = path;
		this.stateKey = stateKey;

		this.dsRecord = global.ds.record.getRecord(subRecord ? "webdashboard/" + subRecord : "webdashboard");
	}

	public componentWillMount() {
		if (this.path) {
			this.dsRecord.subscribe(this.path, this._handleDsUpdate, true);
		} else {
			this.dsRecord.subscribe(this._handleDsUpdate, true);
		}
	}

	public componentDidUnmount() {
		this.dsRecord.unsubscribe(this._handleDsUpdate);
		this.dsRecord.discard();
		this.dsRecord = null;
	}

	private _handleDsUpdate = _.debounce((data) => {
		this.setState({
			[this.stateKey]: data
		});
	}, 1000 / 60, {
		leading: true,
		trailing: true
	});

	public setRecord = (data: any, path: string = this.path) => {
		this.dsRecord.set(path, data);
	}
}
