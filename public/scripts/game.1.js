window.holi = function(){

var objectFiles = [
    './scripts/player.1',
    './scripts/enemy',
    './scripts/bullet'
    ]

require(objectFiles, function () {
var players = [],
    socket,
    UiPlayers = document.getElementById("players");
    //console.log(socket)

var Q = window.Q = Quintus({
    development:true
})                          // Create a new engine instance
              .include("Sprites, Scenes, Input, 2D, TMX, Touch, Anim, UI, Audio") // Load any needed modules
              .include("PlatformerPlayer, PlatformerEnemy, PlatformerBullet")
              .setup({
                  width:960,
                  height:640,
                  scaleToFit: true
              })                           // Add a canvas element onto the page
              .controls()                        // Add in default controls (keyboard, buttons)
              .touch(); 

              

Q.SPRITE_PLAYER = 2;
Q.SPRITE_BULLET = 4;
Q.SPRITE_ENEMY = 8;


    
function setUp(stage){
    socket = io.connect()
    socket.on('count',function(data){
        UiPlayers.innerHTML = 'Players: ' + data['playerCount']

    });
    
    socket.on('connected', function() {
        console.log("Conectado")
        
    socket.emit("identify",{token:"token"});    
      
    });
    
    socket.on("logged", function(data) {
              
       var player = new Q.Player({name:data["nameP"], idPlayer:data["idPlayer"], x:160, y:700, socket:socket},"Fox Molder");
       player.play("idle");
       stage.insert(player);
       stage.add('viewport').follow(player);
        
    });
    
    socket.on('newConnected',function(data) {
        var otherPlayer = new Q.OtherPlayer({id:data['id']},data['name']);
        stage.insert(otherPlayer);
        console.log("Llegaste")
    })
    
}



Q.scene("level",function(stage){
    Q.debug = true;
    Q.stageTMX("level.1.tmx", stage);
    setUp(stage);
});

Q.loadTMX("level.1.tmx, tileset.png, player.json, player.png, bullet.json, bullet.png", function(){
    Q.compileSheets("player.png", "player.json");
    Q.compileSheets("bullet.png", "bullet.json");
    
   Q.animations('player', {
       idle:{frames:[8], loop:false,rate:1/10},
       run_player:{frames:[9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,0,1,2,3,4,5,6,7,8], next:'idle', loop:false,rate:1/10}
    });
    
    Q.animations("bullet",{
        misil:{ frames:[39], rate:1/10, flip:false, loop:false },
        bombo:{ frames:[53], rate:1/10, flip:false, loop:false },
        explotion:{ frames:[63,55,63], rate:1/5, flip:false, loop:false }
    });
    
       Q.stageScene("level"); 
    
    
    
});

});

}