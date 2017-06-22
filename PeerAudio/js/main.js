'use strict';

// var configuration = {
//   'iceServers': [{
//     'urls': 'stun:stun.l.google.com:19302'
//   }]
// };

var configuration = null;

// The default namespace is by default '/', but this variable is to use with numClientsInRoom
var defaultNamespace = '/';



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
  if(numClientsInRoom(room,))
});

socket.on('joined', function(room, clientId) {

});

socket.on('full', function(room, clientId) {

});

socket.on('ready', function() {

});

function numClientsInRoom(namespace, room) {
    var clients = io.nsps[namespace].adapter.rooms[room].sockets;
    return Object.keys(clients).length;
}
