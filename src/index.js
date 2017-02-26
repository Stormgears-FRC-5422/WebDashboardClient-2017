import Inferno from "inferno";
import App from './App';
import './index.scss';

import {Intent} from "@blueprintjs/core";
import {TopToaster} from "./components/Toasters";

import deepstream from "deepstream.io-client-js";
import DeepstreamMixin from "deepstream.io-tools-react";

if (process.env.NODE_ENV !== "production") {
	// require('inferno-devtools');
}

// Inferno.render(<div>
// 	<Spinner/>
// 	Connecting...
// </div>, document.getElementById("root"));

const ds = deepstream(location.hostname + ":5802");

let rendered = false;
ds.login({username: "client"}, () => {
	if (rendered) {
		TopToaster.show({
			message: "Reconnected.",
			intent: Intent.SUCCESS,
			iconName: "tick"
		});
		return;
	}
	rendered = true;
	Inferno.render(
		<App dsRecord="webdashboard" />,
		document.getElementById('root')
	);
});

ds.on("error", function(error, event, topic) {
	TopToaster.show({
		message: "Error: " + event,
		intent: Intent.DANGER,
		iconName: "error"
	});

	console.log(error, event, topic);
});

DeepstreamMixin.setDeepstreamClient(ds);
global.ds = ds;