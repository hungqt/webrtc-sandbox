'use strict';

var defaultNamespace = '/';



// var configuration = {
//   'iceServers': [{
//     'urls': 'stun:stun.l.google.com:19302'
//   }]
// };

var configuration = null;
console.log("test");

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
