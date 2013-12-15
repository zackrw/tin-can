
var App = {};

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


$(function() {

  var friends = $('.friends');
  var chatContainer = $('.chat-container');

  // templates
  var friendTemplate = $('.friend.template');
  var chatTemplate = $('.chat.template');

  // TODO: CONVERT TO A FUNCTION WHICH CAN BE CALLED FOR INDIVIDUAL CHATS.
  $('.friends').on('click', '.friend', function() {
    var conversationId = $(this).attr('data-id');
    if (conversationId !== chatContainer.attr('data-id')) {
      var conversation = App.findConversation(conversationId);
      chatContainer.find('.chats').empty();
      chatContainer.find('.name').text(conversation.name);
      chatContainer.attr('data-id', conversationId);
      var chats = conversation.chats;
      var i, text, time;
      for (i = 0; i < chats.length; i++) {
        text = chats[i].text;
        time = chats[i].time;
        var fromClass = chats[i].mine ? 'mine' : 'theirs';
        chat = chatTemplate.clone().removeClass('template').
                                    addClass(fromClass);

        chat.find('.text').text(text);
        chat.find('.time').text(time);
        chatContainer.find('.chats').append(chat);
      }

    }
  });


  App.populate = function() {
    var i, li, conversation;
    for (i = 0; i < App.conversations.length; i++) {
      conversation = App.conversations[i];
      li = friendTemplate.clone().removeClass('template').
                                  text(conversation.name).
                                  attr('data-id', conversation.id);
      friends.append(li);
    }
  };

  App.findConversation = function(id) {
    var i;
    for (i = 0; i < App.conversations.length; i++) {
      if (App.conversations[i].id === id) {
        return App.conversations[i];
      }
    }
  };

  App.populate();

});







