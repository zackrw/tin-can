var cfg = {"iceServers":[{"url":"stun:23.21.150.121"}]}

var peers = {};

function handleConnection() {
	//TODO
}

function createConnection() {
	var p = new webkitRTCPeerConnection(cfg, null);
	p.onconnection = handleConnection;
}

function parseMessage(msg) {
	console.log("Parsing a new message (from peer or pasted)");
	switch (msg.msg_type) {
		case "text":
			writeToChat(msg);
			break;
		case "offer":
			parseOffer(msg);
			break;
		case "answer":
			parseAnswer(msg);
			break;
	}
}

function parseOffer(msg) {
	if (!(msg.from in peers)) {
		peers[msg.from] = createConnection();
		peers[msg.from].
