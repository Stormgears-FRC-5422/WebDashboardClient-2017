const dgram = require("dgram");
const server = dgram.createSocket({type: "udp4", reuseAddr: true});

server.on('listening', function () {
	server.setBroadcast(true);
	server.setMulticastTTL(128);

	server.addMembership("224.0.0.251", "0.0.0.0");

	const address = server.address();
	console.log('Multicast discovery server listening on ' + address.address + ":" + address.port);
});
server.on('message', function (message, remote) {
	const address = remote.address;
	const msg = message.toString();


	if (msg === "WEBDASHBOARD_REQUEST") {
		console.log("Got a multicast request packet from " + address);
		server.send("WEBDASHBOARD_DISCO", 5802, address);
	}
});
server.bind(5353, "0.0.0.0");

const unicastServer = dgram.createSocket({type: "udp4", reuseAddr: true});
unicastServer.on("listening", function () {
	const address = unicastServer.address();
	console.log('Unicast discovery server listening on ' + address.address + ":" + address.port);
});
unicastServer.on('message', function (message, remote) {
	const address = remote.address;
	const msg = message.toString();

	console.log("Got a unicast request packet from " + address);

	if (msg === "WEBDASHBOARD_REQUEST") {
		server.send("WEBDASHBOARD_DISCO", 5802, address);
	}
});
unicastServer.bind(5803, "0.0.0.0");

// Fallback for when multicast isn't working
const possible = [
	"10.54.22.2",
	"10.54.22.20"
];
setInterval(function () {
	possible.forEach(function (addr) {
		server.send("WEBDASHBOARD_DISCO", 5802, addr);
	});
}, 3000);