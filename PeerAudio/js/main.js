'use strict';

// var configuration = {
//   'iceServers': [{
//     'urls': 'stun:stun.l.google.com:19302'
//   }]
// };

var configuration = null;

var isInitiator;
var room = prompt('Enter room name:');


/*******************************************************************************
* Signaling Server
*******************************************************************************/

//Connect to the signaling server
var socket = io.connect();

// Listens to the servers console logs
socket.on('log', function(array) {
  console.log.apply(console, array);
});

socket.on('created', function(room, clientId) {
  
});

socket.on('joined', function(room, clientId) {

});

socket.on('full', function(room, clientId) {

});

socket.on('ready', function() {

});
