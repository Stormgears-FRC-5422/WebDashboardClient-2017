import React from "react";

let dsClient;
const LOCAL = 'local';

export default class SyncedComponent extends React.Component {
	constructor(props) {
		super(props);
		dsClient = global.ds;
		this._createRecord();
		this.state = this.dsRecord.get();
	}

	componentWillMount() {
		this._createRecord();
	}

	componentWillUnmount() {
		setTimeout(this._destroy, 0);
	}

	// componentWillUpdate( nextProps, nextState ) {
	// 	this.dsRecord.set( this._cloneState( nextState ) );
	// }
	_destroy() {
		if (this.dsRecord.isDestroyed === false) {
			this.dsRecord.unsubscribe(this._setState);
			this.dsRecord.discard();
		}

		delete this.dsRecord;
	}

	setState = (state) => {
		if (!state.local) {
			throw new Error("Only set local values with this.setState.");
		}

		this.superSetState({
			local: state.local
		});
	};

	_setState = (state) => {
		// console.log(state);
		this.superSetState(this._cloneState(state));
	};

	superSetState(state) {
		super.setState(state);
	}

	_cloneState(state) {
		let key,
			clonedState = {};

		for (key in state) {
			if (key !== LOCAL) {
				clonedState[key] = state[key];
			}
		}

		return clonedState;
	}

	_setInitialState() {
		if (this.dsRecord && this.dsRecord.isReady && Object.keys(this.dsRecord.get()).length === 0 && this.state) {
			this.dsRecord.set(this.state);
		}
	}

	_createRecord() {
		if (this.dsRecord) {
			return;
		}

		if (dsClient === null) {
			throw new Error('no deepstream client set. Please call setDeepstreamClient( ds ) before using the deepstream react mixin');
		}

		if (typeof this.props.dsRecord !== 'string') {
			throw new Error('deepstream react mixin requires prop \'dsRecord\'');
		}

		this.dsRecord = dsClient.record.getRecord(this.props.dsRecord);
		this.dsRecord.subscribe(this._setState);

		/*
		 * We can't use record.whenReady here since react complains about its internal usage of `bind`
		 */
		if (this.dsRecord.isReady) {
			setTimeout(this._setInitialState, 0);
		} else {
			this.dsRecord.once('ready', this._setInitialState);
		}
	}
}