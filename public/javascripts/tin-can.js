var cfg = {"iceServers":[{"url": "stun:stun.l.google.com:19302"}]};
var peers = {};
var name = "SnowedInRussia" + Math.floor(Math.random() * 1000);
var mc = {
	"mandatory": {
	"OfferToReceiveAudio":true, 
	"OfferToReceiveVideo":true
	}
};

$("#cmd").html("hi");

$("#intro").click(function() {
	console.log("intro click");
	handleIntro(JSON.parse($("#cmd").val()), true);
});

$("#offer").click(function() {
	handleOffer(JSON.parse($("#cmd").val()), true);
});

$("#answer").click(function() {
	handleAnswer(JSON.parse($("#cmd").val()), true);
});

function send(msg, remote) {
	console.log("Sending message to " + remote);
	peers[remote].dc.send(JSON.stringify(msg));
}

function handleDC(e) {
	console.log("Received open DC event from " + e.target.remote);
	e.channel.onmessage = parseMessage;
	peers[e.target.remote].dc = e.channel;
}

function handleStream(e) {
	console.log("Received media stream: ",  e);
	App.addVideoToConvo(e.stream, e.target.remote);
}

function handleIceCandidate(e) {
	console.log("ice candidate: ", e);
	var c = e.target;
	if (c.print && e.candidate) {
		c.last_msg.ice.push(e.candidate);
		$("#cmd").val(JSON.stringify(c.last_msg));
	}
	var msg = {
		type: 'ice',
		from: name,
		to: c.remote,
		last_hop: name,
		data: e.candidate
	}
	send(msg, c.last_hop);
}

function createConnection(remote) {
	var p = new RTCPeerConnection(cfg, null);

	p.ondatachannel = handleDC;
	p.onopen = function (e) {console.log("On open")};
	p.onicecandidate = handleIceCandidate;
	p.onaddstream = handleStream;
	p.remote = remote;
	p.print = false;

	// Add to chat UI as well
	App.addContact(remote);
	return p;
}

function parseMessage(msg) {
	msg = JSON.parse(msg.data);
	console.log("Parsing a new message: ", msg);

	if (msg.to !== name) {
		console.log("Forwarding msg to " + msg.to );
		msg.last_hop = name;
		peers[msg.to].dc.send(JSON.stringify(msg));
		return;
	}

	//Update last hop
	switch (msg.type) {
		case "text":
			handleChat(msg);
			break;
		case "offer":
			handleOffer(msg);
			break;
		case "answer":
			handleAnswer(msg);
			break;
		case "req_intro":
			handleIntro(msg);
			break;
		case "ice":
			if (msg.from in peers) {
				peers[msg.from].conn.addIceCandidate(new RTCIceCandidate(msg.data));
			}
	}
}

function handleIntro(msg, print) {
	if (!(msg.from in peers)) {
		// TODO: Get user verification
		peers[msg.from] = {
			'conn': createConnection(msg.from)
		};
	}
	peers[msg.from].conn.last_hop = msg.last_hop;

	var out_msg = {
		'to': msg.from,
		'from': name,
		'type': 'offer',
		'last_hop': name
	};

	// Create the datachannel
	peers[msg.from].dc = peers[msg.from].conn.createDataChannel(msg.from, null);

	// Attach the media stream if it exists
	if ("local_stream" in window) {
		console.log("Adding media stream");
		local_stream.remote = name;
		peers[msg.from].conn.addStream(local_stream);
	}

	peers[msg.from].conn.createOffer(function (offer) {
		out_msg.data  = offer;
		peers[msg.from].conn.setLocalDescription(offer);

		// If we're still in the copy-and-paste stage
		if (print) {
			peers[msg.from].conn.print = true;
			out_msg.ice = [];
			peers[msg.from].conn.last_msg = out_msg;
			$("#cmd").val(JSON.stringify(out_msg));
		}
		send(out_msg, msg.last_hop);
	}, function() {console.warn("fuuuuuu")}, mc);
}


function handleOffer(msg, print) {
	if (!(msg.from in peers)) {
		// TODO: Get user verification
		peers[msg.from] = {
			'conn': createConnection(msg.from),
		};
	}
	peers[msg.from].conn.last_hop = msg.last_hop;

	var out_msg = {
		'to': msg.from,
		'from': name,
		'type': 'answer',
		'last_hop': name
	};

	if ("local_stream" in window) {
		console.log("Adding media stream");
		peers[msg.from].conn.addStream(local_stream);
	}

	var offer = new RTCSessionDescription(msg.data);
	peers[msg.from].conn.setRemoteDescription(offer);

	// Handle ice candidates if there are any
	for (var i = 0; 'ice' in msg && i < msg.ice.length; i++) {
		peers[msg.from].conn.addIceCandidate(new RTCIceCandidate(msg.ice[i]));
	}

	peers[msg.from].conn.createAnswer(function (answer) {
		out_msg.data = answer;
		peers[msg.from].conn.setLocalDescription(answer);
		console.log(JSON.stringify(out_msg));
		if (print) {
			peers[msg.from].conn.print = true;
			out_msg.ice = [];
			peers[msg.from].conn.last_msg = out_msg;
			$("#cmd").val(JSON.stringify(out_msg));
		}
		send(out_msg, msg.last_hop);
	}, function() {
		console.warn("Unable to create answer wtf");
	}, mc);
	return 
}

function handleAnswer(msg, print) {
	if (!(msg.from in peers)) {
		console.warn("Answer from unknown peer... weird");
		return;
	}

	try {

		var answer = new RTCSessionDescription(msg.data);
		peers[msg.from].conn.setRemoteDescription(answer);
		
		// Handle ice candidates if there are any
		for (var i = 0; 'ice' in msg && i < msg.ice.length; i++) {
			peers[msg.from].conn.addIceCandidate(new RTCIceCandidate(msg.ice[i]));
		}

		if (print) {
			$("#cmd").val("Commands can go here");
		}
		peers[msg.from].dc.onmessage = parseMessage;
		console.log("DC to " + msg.from + " connected");
	} catch (err) {
		console.warn('Data channel is fucked', err);
	}
}

function handleChat(msg) {
	if (!(msg.from in peers)) {
		console.warn("Chat from unknown peer");
		return;
	}
	App.recMsg(msg);
}

function sendChatMessage(text, remote) {
	var out_msg = {
		to: remote,
		type: 'text',
		last_hop: name,
		from: name,
		data: text
	};
	send(out_msg, remote);
}

function sendIntro(offerer, answerer) {
	var out_msg = {
		to: offerer,
		type: 'text',
		last_hop: name,
		from: answerer,
		needs_verification: true
	};
	send(out_msg, offerer);
}
