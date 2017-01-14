import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

import deepstream from "deepstream.io-client-js";
import DeepstreamMixin from "deepstream.io-tools-react";

import {Spinner} from "@blueprintjs/core/dist/components/spinner/spinner";

ReactDOM.render(<div>
	<Spinner></Spinner>
	Connecting...
</div>, document.getElementById("root"));

const ds = deepstream(location.hostname + ":5802");

ds.login({}, () => {
	ReactDOM.render(
		<App dsRecord="webdashboard" />,
		document.getElementById('root')
	);
});

DeepstreamMixin.setDeepstreamClient(ds);