'use strict';

// var configuration = {
//   'iceServers': [{
//     'urls': 'stun:stun.l.google.com:19302'
//   }]
// };

var configuration = null;

// HTML elements
var localAudio = document.querySelector('#localAudio');
var remoteAudio = document.querySelector('#remoteAudio');

var isInitiator;
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

});

socket.on('joined', function(room, clientId) {
  console.log('joined ' + room);
  isInitiator = false;
});

socket.on('full', function(room, clientId) {

});

socket.on('ready', function() {

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
  .catch(function(e) {
    alert('getUserMedia() error: ' + e.name);
  });
}

function gotStream(stream) {
  var streamURL = window.URL.createObjectURL(stream);
  console.log('getUserMedia Audio stream URL: ', streamURL);
  window.stream = stream;
  audio.src = streamURL;
  audio.onloadedmetadata = function() {
    console.log('Got audio stream');
  }
  // Show a button to record audio
}

/****************************************************************************
* WebRTC peer connection and data channel
****************************************************************************/

var peerCon;
var dataChannel;
