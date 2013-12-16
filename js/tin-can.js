var cfg = {"iceServers":[{"url":"stun:23.21.150.121"}]}

var peers = {};

function handleDC(e) {
	console.log("Opened DC to ", e.target.remote);
	peers[e.target.remote].dc = e.channel;
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
	p.remote = remote;
	return p;
}

function parseMessage(msg) {
	console.log("Parsing a new message (from peer or pasted): ", msg);
	switch (msg.type) {
		case "text":
			writeToChat(msg);
			break;
		case "offer":
			parseOffer(msg);
			break;
		case "answer":
			parseAnswer(msg);
			break;
		case "req_intro":
			parseIntro(msg);
			break;
	}
}

function parseIntro(msg) {
	if (!(msg.from in peers)) {
		peers[msg.from] = {
			'conn': createConnection(msg.from)
		};
	}
	var out_msg = {
		'to': msg.from,
		'from': name,
		'type': 'offer'
	};
	var o;
	peers[msg.from].dc = peers[msg.from].conn.createDataChannel(msg.from, null);
	peers[msg.from].conn.createOffer(function (offer) {
		out_msg.data  = offer;
		peers[msg.from].conn.setLocalDescription(offer);
		console.log(JSON.stringify(out_msg));
	}, function() {console.warn("fuuuuuu")});
	console.log(o);
}
	

function parseOffer(msg) {
	if (!(msg.from in peers)) {
		peers[msg.from] = {
			'conn': createConnection(msg.from),
			'name': msg.from
		};
	}
	var offer = new RTCSessionDescription(msg.data);
	peers[msg.from].conn.setRemoteDescription(offer);
		
	var out_message = {
		'to': msg.from,
		'from': name,
		'type': 'answer',
		'last_hop': name
	};

	peers[msg.from].conn.createAnswer(function (answer) {
		out_message.data = answer;
		peers[msg.from].conn.setLocalDescription(answer);
		console.log(JSON.stringify(out_message));
	}, function() {
		console.warn("Unable to create answer wtf");
	});

	peers[msg.last_hop].dc.send(out_message);
}

function parseAnswer(msg) {
	if (!(msg.from in peers)) {
		console.warn("Answer from unknown peer... weird");
	} else {
		try {
			var answer = new RTCSessionDescription(msg.data);
			console.log('rtc session data');
			peers[msg.from].conn.setRemoteDescription(answer);
			console.log('remote connection');
			peers[msg.from].dc.onmessage = parseMessage;
			console.log('dc');
		} catch (err) {
			console.warn('Data channel is fucked', err);
		}
	}
}

