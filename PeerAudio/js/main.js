'use strict';

// var configuration = {
//   'iceServers': [{
//     'urls': 'stun:stun.l.google.com:19302'
//   }]
// };

var configuration = null;
var localStream;

// HTML elements
var localAudio = document.querySelector('#localAudio');
// var remoteAudio = document.querySelector('#remoteAudio');
var recordBtn = document.getElementById('recordBtn');
var sendBtn = document.getElementById('sendBtn');

// Event handlers on the buttons
recordBtn.addEventListener('click', recordAudio);
sendBtn.addEventListener('click', sendData);

// Peerconnection and data channel variables
var peerCon;
var dataChannel;

// isInitiator is the one who's creating the room
var isInitiator;
// Hard coded room name for now
var room = 'test';


/*******************************************************************************
* Signaling Server
*******************************************************************************/

//Connect to the signaling server
var socket = io.connect();

// Listens to the servers console logs
socket.on('log', function(array) {
  console.log.apply(console, array);
});

// The client tries to create or join a room, only if the room is not blank
if (room !== '') {
  socket.emit('create or join', room);
  console.log('Attempted to create or  join room', room);
}

socket.on('created', function(room, clientId) {
  console.log('Created room ' + room);
  isInitiator = true;
  getAudio();
});

socket.on('joined', function(room, clientId) {
  console.log('joined ' + room);
  isInitiator = false;
  createPeerConnection(isInitiator, configuration);
  getAudio();
});

socket.on('full', function(room, clientId) {

});

socket.on('ready', function() {
  console.log('Socket is ready');
  createPeerConnection(isInitiator, configuration);
});

socket.on('message', function(message) {
  console.log('Client received message:', message);
  signalingMessageCallback(message);
});

/**
* Send message to signaling server
*/
function sendMessage(message) {
  console.log('Client sending message: ', message);
  socket.emit('message', message);
}

/****************************************************************************
* User media (audio)
****************************************************************************/

function getAudio(){
  console.log('Getting user media (audio) ...');
  navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false,
  })
  .then(gotStream)
  // .then(stream => audio.srcObject = gotStream(stream))
  .catch(function(e) {
    alert('getUserMedia() error: ' + e.name);
  });
}

function gotStream(stream) {
  // var streamURL = window.URL.createObjectURL(stream);
  // console.log(stream);
  // console.log('getUserMedia Audio stream URL: ', streamURL);
  // window.stream = stream;
  // audio.src = streamURL;
  // audio.onloadedmetadata = function() {
  //   console.log('Got audio stream');
  // }
  // Show a button to record audio

  console.log('Received local stream');
  localStream = stream;
  var audioTracks = localStream.getAudioTracks();
  if(audioTracks.length > 0) {
    console.log('Using Audio device: ' + audioTracks[0].label);
    console.log(localStream);
  }

}

/****************************************************************************
* WebRTC peer connection and data channel
****************************************************************************/

function signalingMessageCallback(message) {
  if (message.type === 'offer') {
    console.log('Got offer. Sending answer to peer.');
    peerCon.setRemoteDescription(new RTCSessionDescription(message), function(){}, logError);
    peerCon.createAnswer(onLocalSessionCreated, logError);

  } else if (message.type === 'answer') {
    console.log('Got answer');
    peerCon.setRemoteDescription(new RTCSessionDescription(message), function (){}, logError);

  } else if (message.type === 'candidate') {
    peerCon.addIceCandidate(new RTCIceCandidate({
      candidate: message.candidate
    }));

  } else if (message === 'bye') {
    // BAI
  }
}

function createPeerConnection(isInitiator, config) {
  console.log('Creating peer connection as initiator?', isInitiator, 'config', config);
  peerCon = new RTCPeerConnection(config);

  // Send any ice candidates to the other peer
  peerCon.onicecandidate = function(event) {
    console.log('icecandidate event: ', event);
    if(event.candidate) {
      sendMessage({
        type: 'candidate',
        label: event.candidate.sdpMLineIndex,
        id: event.candidate.sdpMid,
        candidate: event.candidate.candidate
      });

    } else {
      console.log('End of candidate');
    }
  };

  if(isInitiator) {
    console.log('Creating Data Channel');
    dataChannel = peerCon.createDataChannel('');
    onDataChannelCreated(dataChannel);

    console.log('Creating an offer');
    peerCon.createOffer(onLocalSessionCreated, logError);

  } else {
    peerCon.ondatachannel = function(event) {
      console.log('ondatachannel:', event.channel);
      dataChannel = event.channel;
      onDataChannelCreated(dataChannel);
    };
  }
}

function onLocalSessionCreated(desc) {
  console.log('local session created: ', desc);
  peerCon.setLocalDescription(desc, function() {
    console.log('sending local desc: ', peerCon.localDescription);
    sendMessage(peerCon.localDescription);
  }, logError);
}

function onDataChannelCreated(channel) {
  console.log('onDataChannelCreated: ', channel);

  channel.onopen = function() {
    console.log('CHANNEL opened!');
  };

  channel.onmessage = (adapter.browserDetails.browser === 'firefox') ?
  receiveDataFirefoxFactory() : receiveDataChromeFactory();
}

function receiveDataChromeFactory() {
  var buf, count;

  return function onmessage(event) {
    if (typeof event.data === 'string') {
      buf = window.buf = new Uint8ClampedArray(parseInt(event.data));
      count = 0;
      console.log('Expecting a total of ' + buf.byteLength + ' bytes');
      return;
    }

    var data = new Uint8ClampedArray(event.data);
    buf.set(data, count);

    count += data.byteLength;
    console.log('count: ' + count);

    if (count === buf.byteLength) {
      // Wer're done: all data chunks have been received
      console.log('Done.');
      //TODO: Receive Audio
    }
  }
}

function receiveDataFirefoxFactory() {
  var count, total, parts;

  return function onmessage(event) {
    if (typeof event.data === 'string') {
      total = parseInt(event.data);
      parts = [];
      count = 0;
      console.log('Expecting a total of ' + total + ' bytes');
      return;
    }

    parts.push(event.data);
    count += event.data.size;
    console.log('Got ' + event.data.size + ' byte(s), ' + (total - count) +
                ' to go.');

    if (count === total) {
      console.log('Assembling payload');
      var buf = new Uint8ClampedArray(total);
      var compose = function(i, pos) {
        var reader = new FileReader();
        reader.onload = function() {
          buf.set(new Uint8ClampedArray(this.result), pos);
          if (i + 1 === parts.length) {
            console.log('Done.');
            //TODO: Receive Audio
          } else {
            compose(i + 1, pos + this.result.byteLength);
          }
        };
        reader.readAsArrayBuffer(parts[i]);
      };
      compose(0, 0);
    }
  };
}

/****************************************************************************
* UI-related functions and ETC
****************************************************************************/

function recordAudio() {

}

function sendData() {

}

function receiveData() {

}


// Show and hide buttons whenever user media is loaded
function show() {

}

function hide() {

}

function randomToken() {
  return Math.floor((1 + Math.random()) * 1e16).toString(16).substring(1);
}

function logError(err) {
  console.log(err.toString(), err);
}
