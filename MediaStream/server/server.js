/* SIMPLE EXPRESS SERVER TO RUN THE MEDIA STREAM APP ON LOCALHOST*/

var express = require('express');
var path = require('path');
var app = express();

//Specify localhost port to 8000
app.set('port', 8000);

app.use(express.static('../public'));

// Listen for requests
var server = app.listen(app.get('port'), function() {
  var port = server.address().port;
  console.log('MediaStream example app listening on port ' + port);
});
