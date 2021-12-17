const http = require('http');
const fs = require('fs');
const port = 1234;
http.createServer(function(request, response) {
    if(request.url === "/snake.js") {
        response.writeHead(200, {'Content-Type': 'text/javascript'});
        fs.createReadStream('snake.js').pipe(response);
    } else if(request.url === "/apple.png") {
        response.writeHead(200, {'Content-Type': 'image/png'});
        fs.createReadStream('apple.png').pipe(response);
    } else {
        response.writeHead(200, {'Content-Type': 'text/html'});
        fs.createReadStream('index.html').pipe(response);
    }
}).listen(port);

//serve.js sorgt dafür, dass ein Webserver gestartet wird auf Grundlage der Dateien index.html und snake.js
//Port ist 1234