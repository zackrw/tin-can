var App = {
  localStream: undefined,
  remoteStream: undefined,
  localSrc: undefined,
  remoteSrc: undefined
};

function hash(s) {
  var h = 0, c;
  for (var i = 0; i < s.length; i++) {
    c = s.charCodeAt(i);
    h = ((h << 5) + h) + c;
  }
  h |= 0;
  return h.toString();
}

/*
 * Change this and call App.populate whenever a new friend comes in.
 */
App.conversations = [
  {
    id: 'ahh329lfh32',
    name: 'Henry Davidge',
    chats: [
      {
        text: 'Hey dude.',
        time: (new Date()),
        mine: true
      },
      {
        text: 'Yo sup.',
        time: (new Date()),
        mine: false
      },
      {
        text: 'Nm.',
        time: (new Date()),
        mine: true
      }
    ]
  },
  {
    id: 'nxh4519l0wi',
    name: 'Reggie Williams',
    chats: [
      {
        text: 'Hey man.',
        time: (new Date()),
        mine: true
      },
      {
        text: 'Yo what\'s happening?',
        time: (new Date()),
        mine: false
      },
      {
        text: 'Chillin, u?',
        time: (new Date()),
        mine: true
      },
      {
        text: 'Same',
        time: (new Date()),
        mine: false
      }
    ]
  }
];
