$(function() {

  var friends = $('.friends');
  var chatContainer = $('.chat-container');
  var chatWrite = $('.chat-write');

  // templates
  var friendTemplate = $('.friend.template');
  var chatTemplate = $('.chat.template');


  // TODO: CONVERT TO A FUNCTION WHICH CAN BE CALLED FOR INDIVIDUAL CHATS.
  friends.on('click', '.friend', function() {
    var conversationId = $(this).attr('data-id');
    if (conversationId !== chatContainer.attr('data-id')) {
      App.selectConversation(conversationId);
      $('.friend').removeClass('selected');
      $(this).addClass('selected');
    }
  });

  App.populate = function() {
    var i, li, conversation;
    for (i = 0; i < App.conversations.length; i++) {
      conversation = App.conversations[i];
			App.showConvo(conversation);
    }
  };

	App.showConvo = function(conversation) {
		var li = friendTemplate.clone().removeClass('template').
																text(conversation.name).
																attr('data-id', conversation.id);
		friends.append(li);
	}


  App.findConversation = function(id) {
    var i;
    for (i = 0; i < App.conversations.length; i++) {
      if (App.conversations[i].id === id) {
        return App.conversations[i];
      }
    }
  };

  App.makeChat = function(chat) {
    var fromClass = chat.mine ? 'mine' : 'theirs';
    var chatEl = chatTemplate.clone().removeClass('template').
                                addClass(fromClass);
    chatEl.find('.text').text(chat.text);
    chatEl.find('.time').text(chat.time.toLocaleTimeString());
    chatContainer.find('.chats').append(chatEl);
  };

  App.selectConversation = function(id) {
    var conversation = App.findConversation(id);
    chatContainer.find('.chats').empty();
    chatContainer.find('.name').text(conversation.name);
    chatContainer.attr('data-id', id);
    var chats = conversation.chats;
    var i, text, time;
    for (i = 0; i < chats.length; i++) {
      App.makeChat(chats[i]);
    }
    App.selectedConversation = id;
    $('.chats').animate({ scrollTop: $('.chats').height() }, 300);
		if (conversation.video) {
			App.fullVidEl.show();
      App.fullVid.pause();
      App.remoteSrc = window.URL.createObjectURL(conversation.video);
      App.miniVid.src = App.localSrc;
      App.flip('mini');
      App.fullVid.src = App.remoteSrc;
			// attachMediaStream(video, conversation.video);
			App.miniVid.play();
      App.fullVid.play();
      // remoteVideo[0].play();
		} else {
			App.fullVidEl.hide()
		}
  };

  App.addChat = function(text, is_mine, id) {
		var id = arguments.length < 3 ? chatContainer.attr('data-id') : id;
    var conversation = App.findConversation(id);
    var chat = {
      text: text,
      time: new Date,
      mine: is_mine
    };
    conversation.chats.push(chat);
    App.makeChat(chat);
    $('.chats').animate({ scrollTop: $('.chats').height() }, 300);
  };


  // populate conversations.
  App.populate();
  // initialize to the first conversation.
  if (App.conversations.length) {
    $($('.friend')[0]).click();
  }

  chatWrite.keypress(function(e) {
    if (e.which === 13 && $(this).val() !== '') {
      App.addChat($(this).val(), true);
			var id = chatContainer.attr('data-id');
			var name = App.findConversation(id).name;
			console.log(chatContainer);
			console.log(name);
			sendChatMessage($(this).val(), name);
      $(this).val('');
    }
  });

	App.recMsg = function(msg) {
		var hashed = hash(msg.from);
		App.addChat(msg.data, false, hashed);
	};

	App.addContact = function(n) {
		var hashed = hash(n);
		var c = {
			name: n,
			id: hashed,
			chats: []
		};
		App.conversations.push(c);
		App.showConvo(c);
	}

	App.addVideoToConvo = function(stream, name) {
		var convo = App.findConversation(hash(name));
		convo.video = stream;
		App.selectConversation(convo.id);
	};
});







