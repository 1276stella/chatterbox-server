var fs = require('fs');
var mime = require('mime');
var storage = {};
storage.results = [{username: 'Jia', text: 'something', roomname: 'lobby'}];
/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.
//
**************************************************************/
var route = function(url) {
  if(url === '/' || url.indexOf('?username') !== -1) {
    return '/client/index.html';
  } else {
    return '/client' + url;
  }
}
var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log("Serving request type " + request.method + " for url " + request.url);
  var statusCode = 200;
  var headers = defaultCorsHeaders;
  var dirname = __dirname;

  if(request.method === 'GET') {
    if (request.url === '/classes/messages') {
      headers['Content-Type'] = 'application/json';
      response.writeHead(statusCode, headers);
      console.log(storage);    
      response.end(JSON.stringify(storage));
    } else {
      var relativeUrl = route(request.url);
      fs.readFile(dirname + relativeUrl, function(err, data){
        console.log('error', err);
        headers['Content-Type'] = mime.lookup(relativeUrl);
        response.writeHead(statusCode, headers);
        response.end(data);
      });
    } 
  } else if(request.method === 'POST') {
      var data = '';
      request.on('data', function(chunk){
        data += chunk;
      });

      request.on('end', function(){
        storage.results.push(JSON.parse(data));
        headers['Content-Type'] = 'application/json';
        response.writeHead(201, headers);
        response.end(JSON.stringify('Success!'));
      });    
  }
  // headers['Content-Type'] = "text/plain";
  // response.writeHead(statusCode, headers);
  // response.end("Hello, World!");
};

exports.handleRequest = requestHandler;
// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve your chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

