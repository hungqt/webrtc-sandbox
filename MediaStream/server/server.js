var http = require("http");
var fs = require("fs");

/* SIMPLE EXPRESS SERVER TO RUN THE MEDIA STREAM APP ON LOCALHOST*/

function onRequest(request, response){
  response.writeHead(200, {'Content-Type': 'text/html'});
  fs.readFile('./index.html', null, function(error, data){
    if(error){
      response.writeHead(404);
      response.write('File not found!');
    } else {
      response.write(data);
    }
    response.end()
  });
}

//Specify localhost port to 8000
http.createServer(onRequest).listen(8000);
