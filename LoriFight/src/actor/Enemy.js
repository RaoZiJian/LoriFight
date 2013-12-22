/**
 * Created by panda on 12/20/13.
 */

var DIST_TO_PLAYER = 480;

//collision type constants
var ENEMY_COL_TYPE = 3;

var ENEMY_DATA = {
    slime: {
        hp: 40,
        base_exp: 20,
        power: 2,
        power_step: 1,
        maxSpeed: 40,
        accel: 20,
        radius: 20,
        weight: 1
    },

    wolf: {
        hp: 70,
        base_exp: 40,
        power: 10,
        power_step: 3,
        maxSpeed: 100,
        accel: 40,
        radius: 28,
        weight: 3
    },

    zombie: {
        hp: 100,
        base_exp: 50,
        power: 8,
        power_step: 2,
        maxSpeed: 55,
        accel: 10,
        radius: 30,
        weight: 10
    }
}


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
            var pos = enemy.getPosition();
            if(pos)
            {
                var dist = cc.pDistance(enemy.getPosition(),playerPos);
            //console.log(dist);

                if(dist <= DIST_TO_PLAYER)
                {
                    enemy.activate();
                }
            }
        }
        //get player position, so monster will go after it
        for(var j=0; j < EnemyActive.length; j++)
        {
            var enemy = EnemyActive[j];
            enemy.body.targetMove(playerPos, enemy.accel);
            var bodyPos = enemy.body.getPosition();
            enemy.setPosition(bodyPos);
            enemy.setZOrder(-bodyPos.y);
        }
    }
};

var Enemy = cc.Sprite.extend({
    hp:100,
    exp:0,
    power:10,
    attackSpeed:80,
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

    spriteFrameCache: null,

    actionManager: null,

    ctor:function(lvl, pos, color){
        this._super();
        this.body = new PhysicsObject(this.weight, this.radius, this.maxSpeed, pos);
        this.body.setView(this);
        //remove this after sprite is properly inited
        this.init(s_sisi, cc.rect(0, 0, 52, 110));
        this.setPosition(pos);
        //this.setScale(0.5);
        this.body.shape.setCollisionType(ENEMY_COL_TYPE);
        this.enemy = GameController.gameScene.sisi;
        this.spriteFrameCache = cc.SpriteFrameCache.getInstance();
        GameController.gameScene.camera.addChild(this);
        this.actionManager = cc.Director.getInstance().getActionManager();
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
        this.walk();
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
        this.scheduleOnce(this.stopAttack, 0.8);
    },

    slash: function() {
        if(this.attackAnime) {
            this.actionManager.removeAllActionsFromTarget(this);
            this.runAction(this.attackAnime);
        }

        this.enemy.attacked(this.power);
    },

    stand: function() {
        if(this.attackAnime)
            this.stopAction(this.attackAnime);
        if(this.runAnime)
            this.stopAction(this.runAnime);
    },

    walk: function() {
        if(this.runAnime) {
            this.actionManager.removeAllActionsFromTarget(this);
            this.runAction(this.runAnime);
        }
    },

    hurt:function(angle){
        // Direction
        var left = Math.abs(angle) < Math.PI/2 ? true : false;
        if(left)
            this.setScaleX(1);
        else this.setScaleX(-1);

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
            this.blood.setRotation(left ? Math.PI : 0);
            this.blood.setPositionType(cc.PARTICLE_TYPE_RELATIVE);
            //this.blood.setAutoRemoveOnFinish(true)
        }
        else{
            this.blood.setRotation(left ? Math.PI : 0);
            this.blood.resetSystem();
        }

        this.hp -= GameController.gameScene.sisi.power;
        if(this.hp<=0)
        {
            this.unschedule(this.stopAttack);
            this.scheduleOnce(this.die, 0);
            return true;
        }
        else return false;
    },
    die:function(){
        //this.removeFromParent();
        this.runAction(
            cc.Sequence.create(
                cc.FadeOut.create(0.3),
                cc.DelayTime.create(0.9),
                cc.CallFunc.create(function(){
                    this.removeFromParent();
                }, this)
            )
        );
        var pop = cc.ParticleSystem.create(fx_pop);
        pop.setAutoRemoveOnFinish(true);
        this.addChild(pop);
        Physics.world.removeShape(this.body.shape);
        Physics.world.removeBody(this.body.body);
        var idx = EnemyActive.indexOf(this);
        if(idx !== -1)
             EnemyActive.splice(idx,1);
    }
});

var Slime = Enemy.extend({

    maxSpeed: ENEMY_DATA.slime.maxSpeed,
    accel: ENEMY_DATA.slime.accel,
    radius: ENEMY_DATA.slime.radius,
    weight: ENEMY_DATA.slime.weight,

    ctor:function(lvl, pos){
        this._super(lvl, pos);

        this.exp = ENEMY_DATA.slime.base_exp * (1 + 0.1 * lvl);
        this.power = ENEMY_DATA.slime.power + ENEMY_DATA.slime.power_step * lvl;
        this.hp = ENEMY_DATA.slime.hp * (1 + 0.15 * lvl);

        var cache = this.spriteFrameCache;
        cache.addSpriteFrames(s_slime_plist, s_slime_png);
        this.initWithSpriteFrame(cache.getSpriteFrame("slime1.png"));

        var run = cc.Animation.create([cache.getSpriteFrame("slime1.png"), cache.getSpriteFrame("slime2.png")], 0.2);
        var attack = cc.Animation.create([cache.getSpriteFrame("slime1.png"), cache.getSpriteFrame("slime2.png")], 0.2);
        this.runAnime = cc.RepeatForever.create(cc.Animate.create(run));
        this.attackAnime = cc.RepeatForever.create(cc.Animate.create(attack));
        this.runAnime.retain();
        this.attackAnime.retain();
        this.scheduleOnce(this.walk, Math.random());
        //GameController.gameScene.slimeBatch.addChild(this);

    }
});
var SlimeLeader = Slime.extend({
    buddies:null,
    ctor:function(lvl, pos, groupsize)
    {
        this._super(lvl, pos);
        this.buddies = [];
        EnemyLeaderContainer.push(this);
        var offset = this.radius*12+groupsize*3;
        for(var i = 0; i < groupsize; i++)
        {
            var buddy = new Slime(lvl-1, cc.pAdd(pos,cc.p((Math.random()-0.5)*offset, (Math.random()-0.5)*offset)));
            var s = Math.random() * 0.8 + 0.6;
            buddy.setScale(s);
            //buddy.setColor(cc.c3b(100 + 100 * Math.random(), 20 * 100 * Math.random(), 50 + 60 * Math.random()));
            this.buddies.push(buddy);
        }
    },
    getGroup: function() {
        return this.buddies
    },
    activate:function(){
        this._super();
        for(var i=0; i < this.buddies.length; i++)
        {
            this.buddies[i].activate();
        }
    },
    die:function(){
        this._super();
        var idx = EnemyLeaderContainer.indexOf(this);
        if(idx !== -1)
            EnemyLeaderContainer.splice(idx,1);
    }
});

var Wolf = Enemy.extend({

    maxSpeed: ENEMY_DATA.wolf.maxSpeed,
    accel: ENEMY_DATA.wolf.accel,
    radius: ENEMY_DATA.wolf.radius,
    weight: ENEMY_DATA.wolf.weight,

    ctor:function(lvl, pos){
        this._super(lvl, pos);

        this.exp = ENEMY_DATA.wolf.base_exp * (1 + 0.1 * lvl);
        this.power = ENEMY_DATA.wolf.power + ENEMY_DATA.wolf.power_step * lvl;
        this.hp = ENEMY_DATA.wolf.hp * (1 + 0.15 * lvl);

        var cache = this.spriteFrameCache;
        cache.addSpriteFrames(s_loup_plist, s_loup_png);
        this.initWithSpriteFrame(cache.getSpriteFrame("wolfWalk1.png"));

        var run = cc.Animation.create([cache.getSpriteFrame("wolfWalk1.png"), cache.getSpriteFrame("wolfWalk2.png")], 0.2);
        var attack = cc.Animation.create([cache.getSpriteFrame("wolfBite1.png"), cache.getSpriteFrame("wolfBite2.png")], 0.2);
        this.runAnime = cc.RepeatForever.create(cc.Animate.create(run));
        this.attackAnime = cc.RepeatForever.create(cc.Animate.create(attack));
        this.runAnime.retain();
        this.attackAnime.retain();
        this.scheduleOnce(this.walk, Math.random());
        //GameController.gameScene.wolfBatch.addChild(this);

    }
});
var WolfLeader = Wolf.extend({
    buddies:null,
    ctor:function(lvl, pos, groupsize)
    {
        this._super(lvl, pos);
        this.buddies = [];
        EnemyLeaderContainer.push(this);
        var offset = this.radius*12+groupsize*4;
        for(var i = 0; i < groupsize; i++)
        {
            var buddy = new Wolf(lvl-1, cc.pAdd(pos,cc.p((Math.random()-0.5)*offset, (Math.random()-0.5)*offset)));
            this.buddies.push(buddy);
        }
    },
    activate:function(){
        this._super();
        for(var i=0; i < this.buddies.length; i++)
        {
            this.buddies[i].activate();
        }
    },
    die:function(){
    this._super();
    var idx = EnemyLeaderContainer.indexOf(this);
    if(idx !== -1)
        EnemyLeaderContainer.splice(idx,1);
}
});


var Zombie = Enemy.extend({

    maxSpeed: ENEMY_DATA.zombie.maxSpeed,
    accel: ENEMY_DATA.zombie.accel,
    radius: ENEMY_DATA.zombie.radius,
    weight: ENEMY_DATA.zombie.weight,

    ctor:function(lvl, pos){
        this._super(lvl, pos);

        this.exp = ENEMY_DATA.zombie.base_exp * (1 + 0.1 * lvl);
        this.power = ENEMY_DATA.zombie.power + ENEMY_DATA.zombie.power_step * lvl;
        this.hp = ENEMY_DATA.zombie.hp * (1 + 0.15 * lvl);

        var cache = this.spriteFrameCache;
        cache.addSpriteFrames(s_zombie_plist, s_zombie_png);
        this.initWithSpriteFrame(cache.getSpriteFrame("zombieMove1.png"));

        var run = cc.Animation.create([cache.getSpriteFrame("zombieMove1.png"), cache.getSpriteFrame("zombieMove2.png")], 0.2);
        var attack = cc.Animation.create([cache.getSpriteFrame("zombieAttack3.png"), cache.getSpriteFrame("zombieAttack4.png")], 0.2);
        this.runAnime = cc.RepeatForever.create(cc.Animate.create(run));
        this.attackAnime = cc.RepeatForever.create(cc.Animate.create(attack));
        this.runAnime.retain();
        this.attackAnime.retain();
        this.scheduleOnce(this.walk, Math.random());
        //GameController.gameScene.zombieBatch.addChild(this);

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
        this.scheduleOnce(this.stopAttack, 0.8);
        cc.AudioEngine.getInstance().playEffect(a_Zombie_Mp3);
    }
});
var ZombieLeader = Zombie.extend({
    buddies:null,
    ctor:function(lvl, pos, groupsize)
    {
        this._super(lvl, pos);
        this.buddies = [];
        EnemyLeaderContainer.push(this);
        var offset = this.radius*10+groupsize;
        for(var i = 0; i < groupsize; i++)
        {
            var buddy = new Zombie(lvl-1, cc.pAdd(pos,cc.p((Math.random()-0.5)*offset, (Math.random()-0.5)*offset)));
            var s = Math.random()*0.5 + 1;
            buddy.setScale(s);
            this.buddies.push(buddy);
        }
    },
    activate:function(){
        this._super();
        for(var i=0; i < this.buddies.length; i++)
        {
            this.buddies[i].activate();
        }
    },
    die:function(){
    this._super();
    var idx = EnemyLeaderContainer.indexOf(this);
    if(idx !== -1)
        EnemyLeaderContainer.splice(idx,1);
}
});