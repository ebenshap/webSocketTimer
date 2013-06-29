var http = require('http')
var fs = require('fs')
var WebSocketServer = require('websocket').server
var WebSocketTimer = require('./webSocketTimer.js')

var server = http.createServer(function(req, res){
  fs.readFile('./client.html',null, function(err, data){
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(data)
  })
})

var wsServer= new WebSocketServer({ httpServer: server })  

wsServer.on('request', function(request){

  var connection= request.accept(null, request.origin) || null
  var timer = new WebSocketTimer({stopTime:10})
  timer.addWebSocket(connection)
  //start the timer as soon as the connection is established
  timer.start() 
    
  connection.on('close', function(connection){
    
    console.log('good bye')
  })         
  
})

server.listen(3000)
