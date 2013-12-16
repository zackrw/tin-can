## What I did
I think that almost everything is functional. The contact introduction system works, sending
messages to remote peers works, and, as far as I can tell, video chat works. We should verify
video chat tomorrow, though - I am not really convinced until it works with a truly remote peer.

## Basic API/internals description
I am very tired so this section will be a bit scattered.
There are four types of messages: req_intro, offer, answer, and text. These should be
self-explanatory. Each peer maintains a map of names -> connections. I intentionally decided
to use user-defined names rather than random strings to identify connections bc I feel its
more anonymity-centric and reduces overhead. And if there are collisions, so be it. 

You will need to call into the connection code to request intros. The sendIntro function should
be of use. I added a TODO at the points that need to call into the UI to get user verification
before. I was debating whether there should be a flag for verification or not (so that copy and
pasted connections would not need to be verifited as well), but decided it would be a too obvious
vulnerability.

## UI needs/wants, ordered by importance
- Introduction UI
- Make the command UI better. Unfortunately we need to have it, but it does not need to be so ugly. I was thinking maybe put it at the bottom of the friends bar, with a dark grey semi-transparent background, but w/e.
	* Sidenote: To manually add a contact, type-in {"type":"req_intro", "from": <contact name to
add>"}, then just follow the copy and paste-sequence. 
- Need some way to set name
- A button to toggle video on/off
	* Today I will try to get multiplexed video streams working, so that if you switch chats the
		video will change automatically. Might be too bandwidth intensive though.
- An FB-chat style feature that provides a notification (lighter color background maybe) and
	moves the contact to the top of the list upon message receipt would be cool. It should not
	autofocus the convo though.
- The UI looks nice when there is video, but without it looks a little weird. Some osx style nature screen savers when there is no video would be awesome.
>>>>>>> 173ae11799eb977687e3b49bd8f293567e834a50

## One note on the demo
Unfortunately we do need to use a stun server - as far as I can tell there is no other way.
WebRTC will not let you connect without it. Because of this, IP address will be detectable, but
messages will not. You could mention that as potential future work.
