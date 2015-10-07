/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var path = require('path');
var fs = require('fs');



var storage = {};
storage.results = [];

var responseHandler = function(response, statusCode, headers) {
  response.writeHead(statusCode, headers);
  response.end(JSON.stringify(storage));
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
  // console.log('REQUEST : ' , request);

  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  headers['Content-Type'] = "application/json";

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  var statusCode;

  if (request.url.indexOf('classes') !== -1 || request.url.indexOf('/') !== -1) {
    //OPTIONS Request Response
      if (request.method === "OPTIONS") {  
        // Add headers to response and send
        // The outgoing status.
        statusCode = 200; 
        responseHandler(response, statusCode, headers);
      }

    //GET Request Response

      if (request.method === 'GET') {  
        statusCode = 200;

        if (request.url.indexOf('/?username') !== -1 || request.url === '/') {
          // var fileName = path.basename(request.url),
          var content = __dirname + '/client/index.html';

          fs.readFile(content, function(error, contents){
              if (!error) {
                headers['Content-Type'] = "text/html";  
                response.writeHead(statusCode, headers);
                response.write(contents);
                response.end();
              } else {
                console.dir(error);
              }

          }); 
        } else if (request.url === '/styles/styles.css') {
          // var fileName = path.basename(request.url),
          console.log('I am a request.url: ', request.url);
          var content = __dirname + '/client/styles/styles.css';

          fs.readFile(content, function(error, contents){
            if (!error) {
              headers['Content-Type'] = 'text/css';
              response.writeHead(statusCode, headers);
              response.write(contents);
              response.end();
            } else {
              console.dir(error);
            }
          });
        } else if (request.url === '/images/spiffygif_46x46.gif') {
          // var fileName = path.basename(request.url),
          var content = __dirname + '/client/images/spiffygif_46x46.gif';

          fs.readFile(content, function(error, contents){
            if (!error) {
              headers['Content-Type'] = 'image/gif';
              response.writeHead(statusCode, headers);
              response.write(contents);
              response.end();
            } else {
              console.dir(error);
            }
          });
        } else if (request.url === '/scripts/app.js') {
          // var fileName = path.basename(request.url),
          var content = __dirname + '/client/scripts/app.js';

          fs.readFile(content, function(error, contents){
            if (!error) {
              headers['Content-Type'] = 'text/javascript';
              response.writeHead(statusCode, headers);
              response.write(contents);
              response.end();
            } else {
              console.dir(error);
            }
          });
        } else if (request.url === '/env/config.js') {
          // var fileName = path.basename(request.url),
          var content = __dirname + '/client/env/config.js';

          fs.readFile(content, function(error, contents){
            if (!error) {
              headers['Content-Type'] = 'text/javascript';
              response.writeHead(statusCode, headers);
              response.write(contents);
              response.end();
            } else {
              console.dir(error);
            }
          });
        } else if (request.url === '/bower_components/jquery/jquery.min.js') {
          // var fileName = path.basename(request.url),
          var content = __dirname + '/client/bower_components/jquery/jquery.min.js';

          fs.readFile(content, function(error, contents){
            if (!error) {
              headers['Content-Type'] = 'text/javascript';
              response.writeHead(statusCode, headers);
              response.write(contents);
              response.end();
            } else {
              console.dir(error);
            }
          });
        } else {
          responseHandler(response, statusCode, headers);
        }
      }

    //POST Request Response
      if (request.method === "POST") {
        statusCode = 201;
        var body = '';
        request.on('data', function(data){ 
          body += data; 
        });

        request.on('end', function(){
          storage.results.push(JSON.parse(body));
          responseHandler(response, statusCode, headers);   
        });
      }
  } else {
    statusCode = 404;
    responseHandler(response, statusCode, headers);  
  }

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.

};

exports.requestHandler = requestHandler;
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

