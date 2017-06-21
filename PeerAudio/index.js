'use strict'

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var connections = [];

server.listen(process.env.PORT || 8000);
console.log('Server running at port ' + process.env.PORT || 8000);

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html')
});

io.sockets.on('connection', function(socket) {
  connections.push(socket);
  console.log('Connected: %s sockets connected', connections.length);

  // Convenience function to log server messages on the client (client listens to it on socket.on('log'))
  function log() {
    var array = ['Message from server: '];
    array.push.apply(array, arguments);
    socket.emit('log', array);
  }

  socket.on('disconnect', function(data) {
    connections.splice(connections.indexOf(socket), 1);
    console.log('Disconnected: %s sockets connected', connections.length);
  });

  socket.on('create or join', function(room) {
    log('Received request to create or join room ' + room);
    

  })
});
