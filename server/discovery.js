const dgram = require("dgram");
const server = dgram.createSocket("udp4");

const possible = [
	"10.54.22.2",
	"10.54.22.20",
	"127.0.0.1"
];

setInterval(function() {
	possible.forEach(function(addr) {
		// server.send("WEBDASHqerlkguaaiuehbadjxygaeisuwdbvkqhi357oreahfdbsklarszyso7hw4erlsukdfhcvx jbwemhsvdcxjyfjhwerdfisuhjvdfsBOARD_DISCO", 5802, addr);
		server.send("WEBDASHBOARD_DISCO", 5802, addr);
	});
}, 500);