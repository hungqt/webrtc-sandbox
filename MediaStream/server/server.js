/* SIMPLE EXPRESS SERVER TO RUN THE MEDIA STREAM APP ON LOCALHOST*/

const express = require('express');
const app = express();
const path = require("path");

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/../client/index.html'));
});

//Specify localhost port to 8000
app.listen(8000, function () {
  console.log('MediaStream example app listening on port 8000');
})
