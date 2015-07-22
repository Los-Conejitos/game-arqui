Quintus.PlatformerPlayer = function(Q){





Q.Sprite.extend("Person",{
    init:function(p, options, name){
        if(options){
            Q._extend(p,options);
        }
        this._super(p,{
            //Stylesheet
            //Con quienes puede colisionar
            //Coordenadas
            //Points de colision del personaje
            //Velocidad
            name:"",
            sheet:"player",
            sprites:"player",
            speed:400,
            jumpSpeed:-800,
            speedBullet:500,
            life:100,
            flip: false,
            //Hace que quintus detecte la collision pero no la maneje
            skipCollide: true,
            collisionMask: Q.SPRITE_BULLET | Q.SPRITE_DEFAULT,
            type: Q.SPRITE_PLAYER
            //Salto
        });
        if(name){
            this.p.name=name;
        }
        this.add('animation');
        this.on("hit.sprite",function(collision){
           //Evalúo con quién colisiona 
           var col = collision.obj;
           if(col.isA("Misil") && col.p.idBulletPlayer!==this.p.idPlayer ){
               this.p.life-=col.p.pointDamage;
               console.log(col.p.pointDamage)
               if(this.life<=0){
                   this.destroy();
               }
               col.destroy();
           }
        });
        
        
    }
    
});


Q.Person.extend("Player",{
    init:function(p,name){
        
      this._super(p,{
 
    },name);
    if(name){
        this.createId()
        }
    this.createId()
    this.add('2d, platformerControls');
    Q.input.on("fire",this,"fire"); 
    },
    fire:function(){
        var p=this.p;
        this.stage.insert(
            new Q.Misil({
            x: p.x,
            y: p.y,
            vx: p.speedBullet,
            vy: 0,
            idBulletPlayer : p.idPlayer
            })
        );
    },
    step:function(dt){
        //bucle principal de la aplicación
        var p = this.p;
        p.flip = p.direction === 'left'?"x":false;
        if(Q.inputs['left']){
        }
        
    },
    createId:function(){
        this.p.idPlayer=this.p.name.concat(new Date().getTime());
    }
    
    
});

Q.Person.extend("OtherPlayer",{
    init:function(p,name){
        
      this._super(p,{
        
        
    },name);
        
    }
});





};