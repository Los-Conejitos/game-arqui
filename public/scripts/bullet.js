Quintus.PlatformerBullet = function(Q){


Q.Sprite.extend("Bullet",{
    init:function(p, options){
        if(options){
            Q._extend(p,options); 
        }
        this._super(p,{
            idBulletPlayer:"",
            pointDamage:0,
            type: Q.SPRITE_BULLET,
            skipCollide:true,
            sensor:true,
            gravityY:0
        });
         this.add('2d');
    },
    step: function(dt){
        if(this.p.vx==0 && this.p.vy==0)this.destroy();
    }
});


Q.Bullet.extend("Misil",{
    init:function(p){
        this._super(p,{
            sheet:"bullet",
            pointDamage:10
        });
        console.log("Holi 2");
    }
});

Q.Bullet.extend("Bomb",{
    init:function(p){
        this._super(p,{
            
        });
    }
});

};