const DeepstreamServer = require('deepstream.io');
const DeepstreamClient = require("deepstream.io-client-js");
const fs = require("fs");
const C = DeepstreamServer.constants;

const server = new DeepstreamServer({
	host: "0.0.0.0",
	port: 5802
});

server.start();

server.addListener("started", function() {
	// Initialize default values
	const client = DeepstreamClient("127.0.0.1:5802").login({username: "server"});
	let record = client.record.getRecord("webdashboard");
	record.set(JSON.parse(fs.readFileSync("default-data.json", "utf-8")));
});