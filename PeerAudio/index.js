'use strict'

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

server.listen(process.env.PORT || 8000);
console.log('Server running at port ' + process.env.PORT || 8000);

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html')
});

io.sockets.on('connection', function(socket) {
  
});
