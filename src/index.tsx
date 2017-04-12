/// <reference path="index.d.ts" />

import Inferno, {VNode} from 'inferno';
import App from "./App";
import "./index.scss";

import {Intent} from "@blueprintjs/core/dist/common/intent";
import {TopToaster} from "./components/Toasters";

import deepstream from "deepstream.io-client-js";
import DeepstreamMixin from "deepstream.io-tools-react";

if (process.env.NODE_ENV !== "production") {
	// FIXME: Uncommenting this line breaks the graph rendering - this should *not* happen!
	// require('inferno-devtools');
}

const ds = deepstream(location.hostname + ":5802");

let rendered = false;
ds.login({username: "client"}, () => {
	if (rendered) {
		TopToaster.show({
			iconName: "tick",
			intent: Intent.SUCCESS,
			message: "Reconnected."
		});
		return;
	}
	rendered = true;
	Inferno.render(
		<App dsRecord="webdashboard" /> as VNode,
		document.getElementById("root")
	);
});

ds.on("error", function(error, event, topic) {
	TopToaster.show({
		iconName: "error",
		intent: Intent.DANGER,
		message: "Error: " + event
	});

	console.log(error, event, topic);
});

DeepstreamMixin.setDeepstreamClient(ds);

global.ds = ds;
