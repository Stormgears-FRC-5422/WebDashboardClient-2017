const superstatic = require("superstatic").server;
const app = superstatic({
	port: 5803,
	host: "0.0.0.0",
	gzip: true
});

const server = app.listen(function() {
	console.log("Static file server started");
});