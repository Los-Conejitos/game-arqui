var http = require('http');
var path = require('path');
//var async = require('async');
var socketio = require('socket.io');
var express = require('express');
var Person;

var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/test')
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  // yay!
  console.log("yeah")
  var GameSchema = mongoose.Schema({
    name: String,
    idPlayer: String,
    points : Number
});

Person = mongoose.model('Person', GameSchema); 

/*var playerA = new Person({name:"Holi", points:3555});
console.log(playerA.name);
playerA.save(function(err, playerA){
  if(err) return console.error(err);
  console.log("Guardó :D")
});*/

Person.find(function (err, persons) {
  if (err) return console.error(err);
  console.log(persons);
})

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
       console.log("Person 2", Person);
      Person.find(function (err, persons) {
  if (err) return console.error(err);
  console.log(persons);
})

      var playerA;
          Person.findOne({'idPlayer':data["token"]},function(err,person){
            console.log("entró");
            if(err) return console.error(err);
              if(!person){
                playerA = new Person({name:data["nameP"],idPlayer:data["token"], points:0});
              console.log(playerA.name);
              playerA.save(function(err, playerA){
              if(err) return console.error(err);
              console.log("Guardó no person :D")
              socket.emit("logged",{nameP:playerA.name,idPlayer:playerA.idPlayer,points:playerA.points});
            });
              }
              else{
              playerA=person;
              console.log("Holi boli")
              socket.emit("logged",{nameP:playerA.name,idPlayer:playerA.idPlayer,points:playerA.points});
            }
          });
          /*console.log("player A",playerA)
          socket.emit("logged",{nameP:playerA.name,idPlayer:playerA.idPlayer,points:playerA.points});*/
  });
  
  socket.on('newConnected', function(data) {
      socket.broadcast.emit('newPersonConnected',data);
  });
  
  socket.on('update',function(data) {
      socket.broadcast.emit('updated',data);
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





});


//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
