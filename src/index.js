import Inferno from "inferno";
import App from './App';
import './index.scss';

import deepstream from "deepstream.io-client-js";
import DeepstreamMixin from "deepstream.io-tools-react";

// import {Spinner} from "@blueprintjs/core/dist/components/spinner/spinner";

if (process.env.NODE_ENV !== "production") {
	// require('inferno-devtools');
}

// Inferno.render(<div>
// 	<Spinner/>
// 	Connecting...
// </div>, document.getElementById("root"));

const ds = deepstream(location.hostname + ":5802");

let rendered = false;
ds.login({}, () => {
	if (rendered) {
		return;
	}
	rendered = true;
	Inferno.render(
		<App dsRecord="webdashboard" />,
		document.getElementById('root')
	);
});

DeepstreamMixin.setDeepstreamClient(ds);
global.ds = ds;