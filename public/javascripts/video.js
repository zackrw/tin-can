
$(function() {

  App.miniVidEl = $('.mini-vid');
  App.fullVidEl = $('.full-vid');
  App.miniVid = App.miniVidEl[0];
  App.fullVid = App.fullVidEl[0];

  App.flip = function(str) {
    var otherStr = str === 'mini' ? 'full' : 'mini';
    App[str + 'VidEl'].addClass('flipped');
    App[otherStr + 'VidEl'].removeClass('flipped');
  };

  var gumTypes = ['getUserMedia', 'webkitGetUserMedia',
               'mozGetUserMedia', 'msGetUserMedia'];

  var gumIndex;
  for (gumIndex = 0; gumIndex < gumTypes.length; gumIndex++) {
    if (navigator[gumTypes[gumIndex]]) {
      break;
    }
  }

  if (navigator[gumTypes[gumIndex]]){
    navigator[gumTypes[gumIndex]]({ video: true }, function(localMediaStream) {
			window.local_stream = localMediaStream;
      App.fullVid.src = window.URL.createObjectURL(localMediaStream);
      App.fullVid.play();
      App.flip('full');
    }, function (err) {
      console.log('Err: ' + err);
    });
  } else {
    alert('getUserMedia() is not supported in your browser');
  }
});

