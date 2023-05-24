const http = require('http');
const fs = require('fs');
var path = require('path');

function onRequest(req, res){
    /*fs.readFile(__dirname+req.url, function(err, content){
        if(!err){
            res.setHeader('Content-Type', 'text/html');
            res.write(content);
        }
        else{
            res.statusCode = 500;
            res.write('An error has occured\n'+err.message);
        }

        res.end();
    });*/

    if(req.url === "/"){
        fs.readFile("index.html", "UTF-8", function(err, html){
            res.writeHead(200, {"Content-Type": "text/html"});
            res.end(html);
        });
    }else if(req.url.match("\.html$")){
        var htmlPath = path.join(__dirname, req.url);
        var fileStream = fs.createReadStream(htmlPath);
        res.writeHead(200, {"Content-Type": "text/html"});
        fileStream.pipe(res);
    }else if(req.url.match("\.css$")){
        var cssPath = path.join(__dirname, req.url);
        var fileStream = fs.createReadStream(cssPath, "UTF-8");
        res.writeHead(200, {"Content-Type": "text/css"});
        fileStream.pipe(res);
    }else if(req.url.match("\.js$")){
        var scriptPath = path.join(__dirname, req.url);
        var fileStream = fs.createReadStream(scriptPath);
        res.writeHead(200, {"Content-Type": "text/javascript"});
        fileStream.pipe(res);
    }else if(req.url.match("\.png$")){
        var imagePath = path.join(__dirname, req.url);
        var fileStream = fs.createReadStream(imagePath);
        res.writeHead(200, {"Content-Type": "image/png"});
        fileStream.pipe(res);
    }else if(req.url.match("\.svg$")){
        var imagePath = path.join(__dirname, req.url);
        var fileStream = fs.createReadStream(imagePath);
        res.writeHead(200, {"Content-Type": "image/svg+xml"});
        fileStream.pipe(res);
    }else if(req.url.match("\.ttf$")){
        var fontPath = path.join(__dirname, req.url);
        var fileStream = fs.createReadStream(fontPath);
        res.writeHead(200, {"Content-Type": "font/ttf"});
        fileStream.pipe(res);
    }else{
        res.writeHead(404, {"Content-Type": "text/html"});
        res.end("No Page Found");
    }
    console.log(req);
}

const server = http.createServer(onRequest);

server.listen(8080);