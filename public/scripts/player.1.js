Quintus.PlatformerPlayer = function(Q){

Q.input.bindKey(68,"special");//Tecla del especial
Q.input.bindKey(65,"primary");//Tecla del ataque primario
'S';//Tecla del ataque secundario

Q.Sprite.extend("OtherPlayer",{
    init:function(p, options){
        var merge={
           
            name:"",
            sheet:"player",
            sprite:"player",
            idPlayer:"Fox Molder",
            life:100,
            flip: "x",
            gravity:0,
            x:0,
            y:0,
            //Hace que quintus detecte la collision pero no la maneje
            skipCollide: true,
            sensor:true,
            collisionMask: Q.SPRITE_BULLET | Q.SPRITE_DEFAULT,
            type: Q.SPRITE_PLAYER
            //Salto 
        }
        if(options){
            Q._extend(merge,options)
        }
        this._super(p,merge);
        this.add('2d , animation');
    },
    
});

Q.Sprite.extend("Player",{
    init:function(p, options){
        var merge={
           //Stylesheet
            //Con quienes puede colisionar
            //Coordenadas
            //Points de colision del personaje
            //Velocidad
            name:"",
            sheet:"player",
            sprite:"player",
            speed:400,
            speedBullet:500,
            speedBulletsecundary:500,
            speedBulletSpecial:500,
            idPlayer:"Fox Molder",
            life:100,
            flip: "x",
            gravity:0,
            //Hace que quintus detecte la collision pero no la maneje
            skipCollide: true,
            collisionMask: Q.SPRITE_BULLET | Q.SPRITE_DEFAULT,
            type: Q.SPRITE_PLAYER
            //Salto 
        }
        if(options){
            Q._extend(merge,options)
        }
        this._super(p,merge);
        this.add('2d , animation');
        this.on("hit.sprite",function(collision){
           //Evalúo con quién colisiona 
           var col = collision.obj;
           if(col.isA("Bullet") && col.p.idBulletPlayer!==this.p.idPlayer ){
               this.p.life-=col.p.pointDamage;
               console.log(col.p.pointDamage)
               if(this.life<=0){
                   this.destroy();
               }
               col.destroy();
           }
        });
        Q.input.on("primary",this,"primaryFire");
        Q.input.on("S",this,"secundaryFire");
        Q.input.on("special",this,"specialFire");            
    },
    step:function(dt){
        //bucle principal de la aplicación
        //var p = this.p;
        //p.flip = p.direction === 'left'?"x":false;
        p = this.p;
        if(Q.inputs['left']){
            p.vx=-this.p.speed;
            p.flip="x";
            this.play("run_player");
        }else if(Q.inputs['right']){
            p.vx=this.p.speed;
            p.flip="";
            this.play("run_player");
        }
        else{
            p.vx=0;
        }
        if(Q.inputs['up']){
            p.vy=-this.p.speed;
            this.play("run_player");
        }else if(Q.inputs['down']){
            p.vy=this.p.speed;
            this.play("run_player");
        }else{
            p.vy=0;
        }
        
        if(!Q.inputs["left"]&&!Q.inputs["right"]&&!Q.inputs["up"]&&!Q.inputs["down"]){
            this.play("idle");
        }
        
    },
    createId:function(){
        if(this.p.name)
        this.p.idPlayer=this.p.name.concat(new Date().getTime());
    },
    getId:function(){
        return this.p.idPlayer;
    },
    primaryFire:function(type){
        var p=this.p;
        var direction = {x:0,y:0};
        direction.x=Q.inputs["left"]?-p.speedBullet:
                    Q.inputs["right"]?p.speedBullet:0;
        direction.y=Q.inputs["up"]?-p.speedBullet:
                    Q.inputs["down"]?p.speedBullet:0;
        if(direction.x==0 && direction.y==0){
            direction.x=p.flip?-p.speedBullet:p.speedBullet;
        }
            this.stage.insert(
                new Q.Misil({
                x: p.x,
                y: p.y,
                vx: direction.x,
                vy: direction.y,
                idBulletPlayer : p.idPlayer
                })
            );
        },
        secundaryFire:function(type){
        var p=this.p;
            this.stage.insert(
                new Q.Bullet({
                x: p.x,
                y: p.y,
                vx: p.speedBullet,
                vy: 0,
                idBulletPlayer : p.idPlayer
                })
            );
        },
        specialFire:function(type){
        var p=this.p;
            this.stage.insert(
                new Q.Bullet({
                x: p.x,
                y: p.y,
                vx: p.speedBullet,
                vy: 0,
                idBulletPlayer : p.idPlayer
                })
            );
    }
    
});

/*Q.Player.extend("Mage",{
    init:function(p){
        this._super(p,{
            sheet:"player",
            sprites:"player",
            speedBulletPrimary:500,
            speedBulletsecundary:500,
            speedBulletSpecial:500
        });
        this.weapon.primaryFire("MageBulletPrimary");
        this.weapon.secundaryFire("MageBulletSecundary");
        this.weapon.specialFire("MageBulletSpecial");
    }
});

Q.Player.extend("Swordsman",{
    init:function(p){
         this._super(p,{
            sheet:"swordsman",
            sprites:"swordsman",
            speedBulletPrimary:500,
            speedBulletsecundary:500,
            speedBulletSpecial:500
        });
        this.primaryFire("SwordsmanBulletPrimary");
        this.secundaryFire("SwordsmanBulletSecundary");
        this.specialFire("swordsmanBulletSpecial");
    }
});

Q.Player.extend("Warrior",{
    init:function(p){
         this._super(p,{
            sheet:"warrior",
            sprites:"warrior",
            speedBulletPrimary:500,
            speedBulletsecundary:500,
            speedBulletSpecial:500
        });
        this.primaryFire("WarriorBulletPrimary");
        this.secundaryFire("WarriorBulletSecundary");
        this.specialFire("WarriorBulletSpecial");
    }
});

Q.Player.extend("Robot",{
    init:function(p){
         this._super(p,{
            sheet:"robot",
            sprites:"robot",
            speedBulletPrimary:500,
            speedBulletsecundary:500,
            speedBulletSpecial:500
        });
        this.primaryFire("RobotBulletPrimary");
        this.secundaryFire("RobotBulletSecundary");
        this.specialFire("RobotBulletSpecial");
    }
});


Q.component("weapon",{
   added:function(){
       this.entity.p.bulletMisil=30;
       this.entity.p.bulletBomb=8;
   },
        primaryFire:function(type){
        var p=this.p;
            Q("Player").stage.insert(
                new Q[type]({
                x: p.x,
                y: p.y,
                vx: p.speedBullet,
                vy: 0,
                idBulletPlayer : p.idPlayer
                })
            );
        },
        secundaryFire:function(type){
        var p=this.p;
            Q("Player").stage.insert(
                new Q[type]({
                x: p.x,
                y: p.y,
                vx: p.speedBullet,
                vy: 0,
                idBulletPlayer : p.idPlayer
                })
            );
        },
        specialFire:function(type){
        var p=this.p;
            Q("Player").stage.insert(
                new Q[type]({
                x: p.x,
                y: p.y,
                vx: p.speedBullet,
                vy: 0,
                idBulletPlayer : p.idPlayer
                })
            );
    },
});
*/

};
