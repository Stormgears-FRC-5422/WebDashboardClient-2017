import Inferno from 'inferno';
import App from './App';
import "./index.css";

import deepstream from "deepstream.io-client-js";
import DeepstreamMixin from "deepstream.io-tools-react";

const ds = deepstream(location.hostname + ":6020");

ds.login({}, () => {
	Inferno.render(
		<App dsRecord="webdashboard" />,
		document.getElementById('root')
	);
})

DeepstreamMixin.setDeepstreamClient(ds);
