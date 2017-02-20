import Inferno from "inferno";
import App from './App';
import './index.css';

import deepstream from "deepstream.io-client-js";
import DeepstreamMixin from "deepstream.io-tools-react";

import {Spinner} from "@blueprintjs/core/dist/components/spinner/spinner";

if (process.env.NODE_ENV !== "production") {
	require('inferno-devtools');
}

// Inferno.render(<div>
// 	<Spinner/>
// 	Connecting...
// </div>, document.getElementById("root"));

const ds = deepstream(location.hostname + ":5802");

ds.login({}, () => {
	Inferno.render(
		<App dsRecord="webdashboard" />,
		document.getElementById('root')
	);
});

DeepstreamMixin.setDeepstreamClient(ds);
global.ds = ds;