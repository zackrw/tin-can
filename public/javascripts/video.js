
$(function() {
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
      var video = $('.video')[0];
      video.src = window.URL.createObjectURL(localMediaStream);
      video.play();

    }, function (err) {
      console.log('Err: ' + err);
    });
  } else {
    alert('getUserMedia() is not supported in your browser');
  }
});




