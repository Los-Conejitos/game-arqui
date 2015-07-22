Quintus.PlatformerPlayer = function(Q){

Q.input.bindKey(68,"special");//Tecla del especial
Q.input.bindKey(65,"primary");//Tecla del ataque primario
'S';//Tecla del ataque secundario
var arr=[];
        arr[1]= new Array();
        arr[0]= new Array();
        arr[-1] = new Array();
        arr[-1][-1]="run_player";
        arr[0][-1]="run_player";
        arr[-1][0]="run_player";
        arr[0][0]="idle";
        arr[1][1]="run_player";
        arr[0][1]="run_player";
        arr[1][0]="run_player";
        arr[-1][1]="run_player"
        arr[1][-1]="run_player"
        
var flip=[];
        flip[1]= new Array();
        flip[0]= new Array();
        flip[-1] = new Array();
        flip[-1][-1]="";
        flip[0][-1]="n";
        flip[-1][-0]="";
        flip[0][0]="n";
        flip[1][1]="x";
        flip[0][1]="n";
        flip[1][0]="x";
        flip[-1][1]="";
        flip[1][-1]="x";

Q.Sprite.extend("OtherPlayer",{
    init:function(p, options){
        var merge={
            time:0,
            direction:{vx:0,vy:0},
            name:"",
            sheet:"lobo",
            sprite:"lobo",
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
        this.on("hit.sprite",function(collision){
           //Evalúo con quién colisiona 
           var col = collision.obj;
           if(col.isA("Misil") && col.p.idBulletPlayer!==this.p.idPlayer ){
               col.destroy();
           }
        });
    },
    step:function(dt){
        if(this.p.time>=10)this.destroy();
        this.p.time+=dt;
        var p = this.p;
        p.direction.vx =  p.vx>0 ? 1:
                        p.vx<0 ? -1: 0;
        
        p.direction.vy =  p.vy>0 ? 1:
                        p.vy<0 ? -1: 0;
        this.changeAnim(p.direction);                
    },
    changeAnim:function(dir){
        
        var p = this.p;
        
        if(flip[dir.vx][dir.vy]!="n"){
           p.flip=flip[dir.vx][dir.vy]; 
        }
        if(arr[dir.vx][dir.vy]!=p.animation){
           this.play(arr[dir.vx][dir.vy]);
        }
    }
    
});

Q.Sprite.extend("Player",{
    init:function(p, options){
        var merge={
           //Stylesheet
            //Con quienes puede colisionar
            //Coordenadas
            //Points de colision del personaje
            //Velocidad
            timebullet:0,
            direction:{vx:0,vy:0},
            name:"",
            sheet:"lobo",
            sprite:"lobo",
            speed:400,
            speedBullet:500,
            speedBulletsecundary:500,
            speedBulletSpecial:500,
            idPlayer:"",
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
           if(col.isA("Misil") && col.p.idBulletPlayer!==this.p.idPlayer ){
               this.p.life-=col.p.pointDamage;
               if(this.p.life<=0){
                   this.p.x=100;
                   this.p.y=100;
                   this.p.socket.emit('dead',{idPlayer:this.p.idPlayer,idBulletPlayer:col.p.idBulletPlayer});
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
        if(this.p.timebullet<1)this.p.timebullet+=dt;
        else{this.p.timebullet=1;}
        var p = this.p;
        if(Q.inputs['left']){
            p.vx=-this.p.speed;
            p.flip="";
            this.play("run_player");
        }else if(Q.inputs['right']){
            p.vx=this.p.speed;
            p.flip="x";
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
        
        if((p.vx !=p.direction.vx) || (p.vy !=p.direction.vy) ){
           p.socket.emit("update",{
            namep:p.name,
            idPlayer:p.idPlayer,
            x:p.x,
            y:p.y,
            vx:p.vx,
            vy:p.vy,
            life:p.life
        });
           p.direction.vx=p.vx;
           p.direction.vy=p.vy;
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
        if(p.timebullet>0.12){
            p.timebullet=0;
        var direction = {x:0,y:0};
        direction.x=Q.inputs["left"]?-p.speedBullet:
                    Q.inputs["right"]?p.speedBullet:0;
        direction.y=Q.inputs["up"]?-p.speedBullet:
                    Q.inputs["down"]?p.speedBullet:0;
        if(direction.x==0 && direction.y==0){
            direction.x=p.flip?p.speedBullet:-p.speedBullet;
        }
        
        p.socket.emit('newMisil',{
                x: p.x,
                y: p.y,
                vx: direction.x,
                vy: direction.y,
                idBulletPlayer : p.idPlayer
                });
        
        var tmp = new Q.Misil({
                x: p.x,
                y: p.y,
                vx: direction.x,
                vy: direction.y,
                idBulletPlayer : p.idPlayer
                });
            this.stage.insert(tmp);
            tmp.play("misil")
    }
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
