var cfg = {"iceServers":[{"url":"stun:23.21.150.121"}]}

var peers = {};

var name = "SnowedInRussia" + Math.floor(Math.random() * 1000);

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
	var video = $('.video')[0];
	attachMediaStream(video, e.stream);
}

function createConnection(remote) {
	var p = new RTCPeerConnection(cfg, null);

	p.ondatachannel = handleDC;
	p.onopen = function (e) {console.log("On open")};
	p.onicecandidate = function (e) {
		console.log("On ice candidate");
		if (e.candidate) {
			p.addIceCandidate(e.candidate);
		}
	}
	p.onaddstream = handleStream;
	p.remote = remote;

	// Add to chat UI as well
	App.addContact(remote);
	return p;
}

function parseMessage(msg) {
	msg = JSON.parse(msg.data);
	console.log("Parsing a new message: " +  msg);
	if (msg.to !== name) {
		console.log("Forwarding msg to " + msg.to );
		msg.last_hop = name;
		peers[msg.to].dc.send(JSON.stringify(msg));
		return;
	}
	switch (msg.type.valueOf()) {
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
	}
}

function handleIntro(msg, print) {
	if (!(msg.from in peers)) {
		// TODO: See if you need verification
		peers[msg.from] = {
			'conn': createConnection(msg.from)
		};
	}
	var out_msg = {
		'to': msg.from,
		'from': name,
		'type': 'offer',
		'last_hop': name
	};
	var o;
	peers[msg.from].dc = peers[msg.from].conn.createDataChannel(msg.from, null);
	if ("local_stream" in window) {
		peers[msg.from].conn.addStream(local_stream);
	}
	peers[msg.from].conn.createOffer(function (offer) {
		out_msg.data  = offer;
		peers[msg.from].conn.setLocalDescription(offer);
		console.log(JSON.stringify(out_msg));
		if (print) {
			console.log("Should print");
			$("#cmd").val(JSON.stringify(out_msg));
		}
		send(out_msg, msg.last_hop);
	}, function() {console.warn("fuuuuuu")});
	console.log(o);
}


function handleOffer(msg, print) {
	if (!(msg.from in peers)) {
		// TODO: See if you need verification
		peers[msg.from] = {
			'conn': createConnection(msg.from),
		};
	}
	var offer = new RTCSessionDescription(msg.data);
	peers[msg.from].conn.setRemoteDescription(offer);

	var out_msg = {
		'to': msg.from,
		'from': name,
		'type': 'answer',
		'last_hop': name
	};

	if ("local_stream" in window) {
		peers[msg.from].conn.addStream(local_stream);
	}
	peers[msg.from].conn.createAnswer(function (answer) {
		out_msg.data = answer;
		peers[msg.from].conn.setLocalDescription(answer);
		console.log(JSON.stringify(out_msg));
		if (print) {
			$("#cmd").val(JSON.stringify(out_msg));
		}
		send(out_msg, msg.last_hop);
	}, function() {
		console.warn("Unable to create answer wtf");
	});
	return 
}

function handleAnswer(msg, print) {
	if (!(msg.from in peers)) {
		console.warn("Answer from unknown peer... weird");
	} else {
		try {
			var answer = new RTCSessionDescription(msg.data);
			peers[msg.from].conn.setRemoteDescription(answer);
			if (print) {
				$("#cmd").val("Commands can go here");
			}
			peers[msg.from].dc.onmessage = parseMessage;
			console.log("DC to " + msg.from + " connected");
		} catch (err) {
			console.warn('Data channel is fucked', err);
		}
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


