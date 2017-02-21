const DeepstreamClient = require("deepstream.io-client-js");

const client = DeepstreamClient("127.0.0.1:5802").login();
let record = client.record.getRecord("webdashboard");

setInterval(function() {
	for (let i = 0; i < 4; i++) {
		record.set("talons[" + i + "].getValue", Math.random());
		record.set("talons[" + i + "].outputCurrent", Math.random());
		record.set("talons[" + i + "].outputVoltage", Math.random());
		record.set("talons[" + i + "].encPosition", Math.round(Math.random() * 100000 - 50000));
		record.set("talons[" + i + "].encVelocity", Math.round(Math.random() * 10000 - 5000));
		record.set("talons[" + i + "].position", Math.round(Math.random() * 100000 - 50000));
		record.set("talons[" + i + "].speed", Math.round(Math.random() * 10000 - 5000));
	}
	record.set("fakeTest", Math.random());
}, 250);