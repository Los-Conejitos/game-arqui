Quintus.PlatformerEnemy = function(Q){

Q.Sprite.extend("Enemy",{
    init:function(p){
        this._super(p,{
            speed:200,
            speedBullet:500
        });
        Q.input.on("fire",this,"fire");
        Q.input.on("bombFire",this,"bombFire");
    },
    fire:function(){
        var p=this.p;
            this.stage.insert(
                new Q.Misil({
                x:this.x,
                y:this.y,
                vx: p.speedBullet,
                vy: 0
                })
            );
    },
    bombFire:function(){
        var p=this.p,
            dx =  Math.sin(p.angle * Math.PI / 180),
            dy = -Math.cos(p.angle * Math.PI / 180);
            this.stage.insert(
                new Q.Bomb({
                x:this.x,
                y:this.y,
                vx: dx * p.speedBullet,
                vy: dy * p.speedBullet
                })
            );
    }
});


Q.Enemy.extend("Hunter",{
    init:function(p){
        this._super(p,{
            speed:200
        });
    }
})





};