/**
 * Created by panda on 12/20/13.
 */

var DIST_TO_PLAYER = 300;

//collision type constants
var ENEMY_COL_TYPE = 3;


var EnemyLeaderContainer = [];
var EnemyActive = [];
var EnemyController = {
    update:function(){
        if(GameController.gameScene.sisi){
            var playerPos = GameController.gameScene.sisi.getPosition();
            //var playerPos = cc.p(300,400);

        }
        //test only
        else{
            var playerPos = cc.p(300,400);
        }
        for(var i=0; i < EnemyLeaderContainer.length; i++)
        {
            var enemy = EnemyLeaderContainer[i];
            var dist = cc.pDistance(enemy.getPosition(),playerPos);
            //console.log(dist);

            if(dist <= DIST_TO_PLAYER)
            {
                enemy.activate();
            }
        }
        //get player position, so monster will go after it
        for(var j=0; j < EnemyActive.length; j++)
        {
            var enemy = EnemyActive[j];
            enemy.body.targetMove(playerPos, enemy.accel);
            enemy.setPosition(enemy.body.getPosition());
        }
    }
};

var Enemy = cc.Sprite.extend({
    hp:100,
    power:10,
    attackSpeed:800,
    level:1,
    maxSpeed:50,
    accel:20,
    body:null,
    radius:20,
    weight:1,
    activated:false,
    color:null,
    blood:null,

    // Animations
    attackAnime:null,
    runAnime:null,

    // Tags
    attacking: false,
    moving: false,
    lastAttack: 0,

    // Sisi
    enemy: null,

    ctor:function(lvl, pos, color){
        this._super();
        this.body = new PhysicsObject(this.weight, this.radius, this.maxSpeed, pos);
        this.body.setView(this);
        //remove this after sprite is properly inited
        this.init(s_sisi, cc.rect(0, 0, 52, 110));
        this.setPosition(pos);
        GameController.gameScene.camera.addChild(this);
        //this.setScale(0.5);
        this.body.shape.setCollisionType(ENEMY_COL_TYPE);
        if(color)
        this.setColor(color);

        this.enemy = GameController.gameScene.sisi;
    },
    activate:function(){
        if(!this.activated)
        {
            EnemyActive.push(this);
            this.activated = true;
        }
    },

    stopAttack: function() {
        this.attacking = false;
        this.moving ? this.walk() : this.stand();
    },

    attack: function() {
        this.attacking = true;
        this.unschedule(this.stopAttack);
        var now = Date.now();
        if(now - this.lastAttack > this.attackSpeed)
        {
            this.lastAttack = now;
            this.scheduleOnce(this.slash,0);
        }
        this.scheduleOnce(this.stopAttack, 1.5);
    },

    slash: function() {
        if(this.attackAnime)
            this.runAction(this.attackAnime);

        this.enemy.attacked(this.power);
    },

    stand: function() {
        if(this.attackAnime)
            this.stopAction(this.attackAnime);
        if(this.runAnime)
            this.stopAction(this.runAnime);
    },

    walk: function() {
        if(this.runAnime)
            this.runAction(this.runAnime);
    },

    hurt:function(angle){
        // Backward
        var v = cc.p(300, 0);
        var impulse = cc.pRotateByAngle(v, cc.p(0,0), angle);
        this.body.setMaxSpeed(500);
        this.body.body.applyImpulse(impulse, cp.v(0, 0));
        var self = this;
        this.scheduleOnce(function() {
            self.body.setMaxSpeed(self.maxSpeed);
        }, 0.2);

        //spawn a particle
        if(!this.blood)
        {
            this.blood = cc.ParticleSystem.create(fx_blood);
            this.addChild(this.blood);
            this.blood.setRotation(-angle);
            this.blood.setPositionType(cc.PARTICLE_TYPE_RELATIVE);
            //this.blood.setAutoRemoveOnFinish(true)
        }
        else{
            this.blood.setRotation(-angle);
            this.blood.resetSystem();
        }
    }
});

var Slime = Enemy.extend({

    ctor:function(lvl, pos){
        this._super(lvl, pos)
    }
});
var SlimeLeader = Slime.extend({
    buddies:null,
    ctor:function(lvl, pos, groupsize)
    {
        this._super(lvl, pos);
        this.buddies = [];
        EnemyLeaderContainer.push(this);
        var offset = this.radius*10+groupsize;
        for(var i = 0; i < groupsize; i++)
        {
            var buddy = new Slime(lvl-1, cc.pAdd(pos,cc.p((Math.random()-0.5)*offset, (Math.random()-0.5)*offset)));
            this.buddies.push(buddy);
        }
    },
    activate:function(){
        this._super();
        for(var i=0; i < this.buddies.length; i++)
        {
            this.buddies[i].activate();
        }
    }
});