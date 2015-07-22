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
         this.add('2d, animation');
    },
    step: function(dt){
        if(this.p.x<=80 || this.p.x>=1808 || this.p.y<=80 || this.p.y>=1808)this.destroy();
    }
});


Q.Bullet.extend("Misil",{
    init:function(p){
        this._super(p,{
            sheet:"bullet",
            sprite:"bullet",
            pointDamage:10
        });
    }
});

Q.Bullet.extend("Bomb",{
    init:function(p){
        this._super(p,{
            
        });
    }
});

};