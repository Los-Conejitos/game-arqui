window.holi = function holiF(nameDePlayer,idDePlayer){

var objectFiles = [
    './scripts/player',
    './scripts/enemy',
    './scripts/bullet'
    ]

require(objectFiles, function () {
var players = [],
    socket,
    UiPlayers = document.getElementById("players");

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
        
    socket.emit("identify",{token:idDePlayer, nameP:nameDePlayer});    
      
    });
    
    socket.on("logged", function(data) {
              
       var player = new Q.Player({name:data["nameP"], idPlayer:data["idPlayer"], x:160, y:700, socket:socket});
       player.play("idle");
       stage.insert(player);
       stage.add('viewport').follow(player,{x:true,y:true},{
           minX:0,maxX:1920,minY:0,maxY:1920
       });
       socket.emit('newConnected',{nameP:data["nameP"],idPlayer:data["idPlayer"],x:160,y:700});
        
    });
    
    socket.on('newPersonConnected',function(data) {
        var otherPlayer = new Q.OtherPlayer({name:data['nameP'], idPlayer:data['idPlayer'],x:data['x'],y:data['y']});
        stage.insert(otherPlayer);
    });
    
    socket.on('deaded',function(data) {
         var otherPlayer = Q("OtherPlayer").items.filter(function(obj){
            return obj.p.idPlayer == data['idPlayer'];
        })[0];
        if(otherPlayer)otherPlayer.destroy();
    })
    
    socket.on('updated',function(data) {
        var otherPlayer = Q("OtherPlayer").items.filter(function(obj){
            return obj.p.idPlayer == data['idPlayer'];
        })[0];
        
        if(otherPlayer){
            otherPlayer.p.x = data['x'];
            otherPlayer.p.y = data['y'];
            otherPlayer.p.vx = data['vx'];
            otherPlayer.p.vy = data['vy'];
            otherPlayer.p.life = data['life'];
            otherPlayer.p.time = 0;
        }else{
            var tmp = new Q.OtherPlayer({
                name:data['nameP'], 
                idPlayer:data['idPlayer'],
                x:data['x'],
                y:data['y'],
                vx: data["vx"],
                vy: data["vy"],
                life: data["life"]
            });
            stage.insert(tmp);
        }
        
    });
    
    socket.on('createMisil',function(data) {
        var tmp = new Q.Misil(data);
        stage.insert(tmp);
        tmp.play("misil");
    })
    
}



Q.scene("level",function(stage){
    Q.debug = true;
    Q.stageTMX("arena.tmx", stage);
    setUp(stage);
});

Q.loadTMX("arena.tmx, tiles-32-32.png, lobo.json, lobo.png, bullet.json, bullet.png", function(){
    Q.compileSheets("lobo.png", "lobo.json");
    Q.compileSheets("bullet.png", "bullet.json");
    
   Q.animations('lobo', {
       idle:{frames:[9], loop:false,rate:1/10},
       run_player:{frames:[0,1,2,3,4,5,6,7,8,9], next:'idle', loop:false,rate:1/10}
    });
    
    Q.animations("bullet",{
        misil:{ frames:[37], rate:1/10, flip:false, loop:false },
        bombo:{ frames:[53], rate:1/10, flip:false, loop:false },
        explotion:{ frames:[63,55,63], rate:1/5, flip:false, loop:false }
    });
    
       Q.stageScene("level"); 
    
    
    
}, {
  progressCallback: function(loaded,total) {
    var element = document.getElementById("loading_progress");
    element.style.width = Math.floor(loaded/total*100) + "%";
    if(loaded == total){
        var canvas = document.getElementById("quintus_container");
        document.getElementById("loading").remove();
        canvas.style.display = "block";
    
    }
  }
}
);

});

}