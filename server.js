var http = require('http');
var path = require('path');

//var async = require('async');
var socketio = require('socket.io');
var express = require('express');

//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
var router = express();
var server = http.createServer(router);
var io = socketio.listen(server);


router.use(express.static(__dirname + '/public'));
 
router.get('/', function(req, res){
  res.render('/index.html');
});

var playerCount = 0,
    id = [],
    player = [];
    

io.on('connection',function(socket){
  
  playerCount++;
  setTimeout(function(){
    console.log("Comienzo")
    socket.emit('connected');
    //io.emit('count',{playerCount:playerCount});
    
  },2500);
  
  socket.on("identify",function(data) {
      //buscar en base de datos
      var name,
          id;
          
          socket.emit("logged",{nameP:name,idPlayer:id});
          
  })
  
 /* socket.on('disconnect',function(){
    playerCount--;
    io.emit('count',{playerCount:playerCount});
  });*/

  socket.on('identify',function(data) {
      id.push(data['id']);
      player.push(data['name']);
      console.log("Primer Hola")
      socket.broadcast.emit('newConnected',{id:data['id'],name:data['name']});
      console.log("Hola")

  });
  
  
  
  
});





 
server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0");
console.log("Game listening on port :D");
