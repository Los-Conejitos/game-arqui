window.addEventListener("load",function() {

var players = [],
    socket,
    UiPlayers = document.getElementById("players");
    //console.log(socket)

var Q =window.Q= Quintus({
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
       var player = new Q.Player({ x:160, y:700, socket:socket},"Fox Molder");
       stage.insert(player);
       stage.add('viewport').follow(player);
        console.log("ID: ",player.p.idPlayer)
        console.log("Name: ", player.p.name)
       socket.emit('identify',{id:player.p.idPlayer, name:player.p.name})
      
    });
    
    socket.on('newConnected',function(data) {
        var otherPlayer = new Q.OtherPlayer({id:data['id']},data['name']);
        stage.insert(otherPlayer);
        console.log("Llegaste")
    })
    
}



Q.scene("level",function(stage){
    Q.stageTMX("level.tmx", stage);
    Q("Player").first().destroy();
    setUp(stage);
});

Q.loadTMX("level.tmx, tileset.png, player.json, player.png, bullet.json, bullet.png", function(){
    Q.compileSheets("player.png", "player.json");
    Q.compileSheets("bullet.png", "bullet.json");
    
    Q.animations("player", {
       idle:{frames:[8], rate:1/15, flip:false, loop:false},
       run:{frames:[9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,0,1,2,3,4,5,6,7,8], rate:1/15, flip:false, loop:false}
    });
    
    Q.animations("bullet",{
        misil:{ frames:[39], rate:1/10, flip:false, loop:false },
        bombo:{ frames:[53], rate:1/10, flip:false, loop:false },
        explotion:{ frames:[63,55,63], rate:1/5, flip:false, loop:false }
    });
    Q.stageScene("level");
    
});


});