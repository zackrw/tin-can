$(function() {
  var addFriendButton = $('.add-friend-button');
  var changeNameButton = $('.change-name-button');

  var overlay = $('.overlay');
  var addFriendOverlay = $('.add-friend-overlay');
  var changeNameOverlay = $('.change-name-overlay');

  var createOfferButton = $('.create-offer-button');
  var enterOfferButton = $('.enter-offer-button');
  var createOfferOverlay = $('.create-offer-overlay');
  var enterOfferOverlay = $('.enter-offer-overlay');

  var createOfferSubmit = $('.create-offer-submit');
  var showOfferOverlay = $('.show-offer-overlay');
  var offerEl = $('.offer');

  var enterOfferSubmit = $('.enter-offer-submit');
  var showAnswerOverlay = $('.show-answer-overlay');
  var answerEl = $('.answer');

  var createConnectionSubmit = $('.create-connection-submit');

  var changeNameSubmit = $('.change-name-submit');

  overlay.click(function(e) {
    if (e.target === this) {
      $(this).hide();
    }
  });

  addFriendButton.click(function() {
    overlay.hide();
    addFriendOverlay.show();
  });

  createOfferButton.click(function() {
    overlay.hide();
    $('.friend-name').text('');
    createOfferOverlay.show();
    setTimeout(function() {
      $('.friend-name').focus()
    }, 500);
  });
  enterOfferButton.click(function() {
    overlay.hide();
    offerEl.text('');
    enterOfferOverlay.show();
  });

  createOfferSubmit.click(function() {
    var friendName = $('.friend-name').val();
    var offerSeed = {
      type: 'req_intro',
      from: friendName
    };

    handleIntro(offerSeed, true, function(offer) {
      offerEl.text(JSON.stringify(offer));
      overlay.hide();
      showOfferOverlay.show();
      $('.friend-name').val('');
    });
  });

  enterOfferSubmit.click(function() {
    handleOffer(JSON.parse($('.offer-paste').val()), true, function(answer) {
      answerEl.text(JSON.stringify(answer));
      overlay.hide();
      showAnswerOverlay.show();
      offerEl.text('');
    });
  });

  createConnectionSubmit.click(function(from) {
    handleAnswer(JSON.parse($('.answer-paste').val()), true, function() {
      // alert('You are connected to ' + JSON.stringify(from));
      overlay.hide();
      $('.answer-paste').val('');
      offerEl.text('');
    });
  });




  changeNameButton.click(function() {
    $('.user-name').val(App.name);
    changeNameOverlay.show();
  });

  changeNameSubmit.click(function() {
    App.name = $('.user-name').val();
    changeNameOverlay.hide();
  });

});
