import Component from "inferno-component";
import _ from "lodash";
import debounce from "lodash/debounce";

export default class SyncedComponent extends Component {
	path;
	stateKey;
	dsRecord;

	constructor(props, path, stateKey, subRecord) {
		super(props);

		this.path = path;
		this.stateKey = stateKey;

		this.dsRecord = global.ds.record.getRecord(subRecord ? "webdashboard/" + subRecord : "webdashboard");
	}

	componentWillMount() {
		if (this.path) {
			this.dsRecord.subscribe(this.path, this._handleDsUpdate, true);
		} else {
			this.dsRecord.subscribe(this._handleDsUpdate, true);
		}
	}

	componentDidUnmount() {
		this.dsRecord.unsubscribe(this._setState);
		this.dsRecord.discard();
		this.dsRecord = null;
	}

	_handleDsUpdate = _.debounce((data) => {
		this.setState({
			[this.stateKey]: data
		});
	}, 1000 / 60, {
		leading: true,
		trailing: true
	});

	setRecord = (data, path = this.path) => {
		this.dsRecord.set(path, data);
	};
}