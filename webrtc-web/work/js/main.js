'use strict';

var isInfitiator;

window.room = prompt("Enter room name: ");

var socket = io.connect();

if(room !== "") {
  console.log('Message from client: Asking to join room ' + room);
  socket.emit('Create or join ', room);
}

socket.on('created', function(room, clientId) {
  isInfitiator = true;
});

socket.on('full', function(room) {
  console.log('Message from client: Room ' + room + ' is full :^(');
});

socket.on('ipaddr', function(ipaddr) {
  console.log('Message from client: Server IP address is ' + ipaddr);
});

socket.on('joined', function(room, clientId) {
  isInfitiator = false;
});

socket.on('log', function(array) {
  console.log.apply(console, array);
});
