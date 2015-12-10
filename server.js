var http = require('http');
var fs = require('fs');
var frontend = require('./frontend.js');
var frontendInst = new frontend();

function handleRequest(request, response){
	fs.appendFile("/tmp/accessLog", JSON.stringify(request.headers) + '\n\n\n', function(err) {
	
	}); 

	var staticFolder = '/static';
	console.log(request.url);
	if (request.url.slice(0, staticFolder.length) == staticFolder) {
		var contentType = frontendInst.getContentType(request.url);
		var contentBody = frontendInst.getContentBody(request.url, contentType);
		response.writeHeader(200, {"Content-Type": contentType});  
		response.write(contentBody);  
		response.end(); 
	} else {
		if (request.url == '/favicon.ico') {
			response.write('');  
			response.end(); 						
		} else {
			var layout = frontendInst.getLayout();
			var template = '';
			switch (request.url) {
				case '/about':
					template = 'about';
				break;
				case '/contact':
					template = 'contact';
				break;
				default:
					template = 'main';
			}
			var content = frontendInst.getContentFromTemplate(template);
			var html = frontendInst.injectContentToLayout(layout, content);
			response.writeHeader(200, {"Content-Type": "text/html"});  
			response.write(html);  
			response.end(); 						
		}
	}

}

var server = http.createServer(handleRequest);

server.listen(8080, function() {
    console.log("Server listening...");
});