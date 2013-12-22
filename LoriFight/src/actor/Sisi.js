/**
 * Created by panda on 12/20/13.
 */
var SISI_COL_TYPE = 10;
var ATTACK_COL_TYPE  = 20;

var SISI_DATA = {
    base_levelup_xp: 5000,
    levelup_xp_step: 5000,
    base_hp: 500,
    hp_step: 200,
    base_power: 50,
    power_step: 40,
    maxSpeed: 200,
    radius: 20,
    weight: 10
};

var Sisi = ccs.Armature.extend({

    level: 1,
    exp: 0,
    levelup_exp: SISI_DATA.base_levelup_xp,
    killed: 0,
    hp: SISI_DATA.base_hp,
    fullHp: SISI_DATA.base_hp,
    power: SISI_DATA.base_power,
    attackSpeed: 500,
    lastAttack:0,
    moveSpeed: SISI_DATA.maxSpeed,
    weight: SISI_DATA.weight,
    radius: SISI_DATA.radius,
    anger: 0,

    levelBut: 70,

    preserved: {
        power: 0,
        attackSpeed: 0,
        moveSpeed: 0
    },

    target: null,
    moving: false,
    attacking: false,

    uiLayer: null,

    body: null,

    mushrooms: null,
    emotion: null,
    cutting: null,
    cutAction: null,

    skill: null,

    attackPos:null,
    ctor: function() {
        this._super();

        //this.init(s_sisi, cc.rect(0, 0, 52, 110));
        this.init("CCArmature");

        this.uiLayer = GameController.gameScene.gameMenuUI;

        this.body = new PhysicsObject(this.weight, this.radius, this.moveSpeed);
        this.body.shape.setCollisionType(SISI_COL_TYPE);

        this.cutting = new cc.Sprite.create(s_cut_png, cc.rect(0, 0, 143, 102));
        this.cutting.setOpacity(0);
        this.addChild(this.cutting);
        this.cutting.setAnchorPoint(0, 0.5);
        this.cutting.setPosition(this.getContentSize().width, this.getContentSize().height/2);

        //this.cutAction = new cc.Spawn.create(cc.ScaleTo.create(2, 0.5), cc.);

        this.mushrooms = [];

        if(!this.loadFromLocal())
            this.setLevel(1);
    },

    saveToLocal: function() {
        sys.localStorage.setItem("sisilevel", this.level);
        sys.localStorage.setItem("sisiexp", this.exp);
    },

    loadFromLocal: function() {
        var level;
        if(level = sys.localStorage.getItem("sisilevel")) {
            this.level = level;
            this.exp = sys.localStorage.getItem("sisiexp");
            return true;
        }
        else return false;
    },

    setLevel: function(lvl) {
        this.level = lvl;
        this.levelup_exp = SISI_DATA.base_levelup_xp + SISI_DATA.levelup_xp_step * lvl;
        this.fullHp = this.hp = SISI_DATA.base_hp + SISI_DATA.hp_step * lvl;
        this.power = SISI_DATA.base_power + SISI_DATA.power_step * lvl;
    },

    setTarget: function(tar) {
        this.target = tar;
        this.moving = true;

        this.setDirection(this.target.x - this.getPosition().x);

        this.walk();
        this.attacking = false;
        this.unschedule(this.stopAttack);
    },

    setMoveSpeed: function(speed) {
        this.moveSpeed = speed;
    },

    setAttackSpeed: function(speed) {
        this.attackSpeed = speed;
    },

    resetPreserved: function() {
        this.setMoveSpeed(this.preserved.moveSpeed);
        this.setAttackSpeed(this.preserved.attackSpeed);
        this.power = this.preserved.power;
    },

    removeMushroom: function() {
        for(var i = 0, l = this.mushrooms.length; i < this.mushrooms.length; i++) {
            var mushroom = this.mushrooms[i];
            if(mushroom.destroyed && !mushroom.sisiAttacked) {
                var res = this.mushrooms.splice(i, 1);
                if(res.length != 0) i--;
            }
        }

    },

    gotMushroom: function(mushroom) {
        this.preserved.power = this.power;
        this.preserved.attackSpeed = this.attackSpeed;
        this.preserved.moveSpeed = this.moveSpeed;

        this.mushrooms.push( mushroom );
        mushroom.trigger();
        this.anger += mushroom.angerValue;

        var prev = this.uiLayer.angerFire.length;
        this.uiLayer.setAngerExpression(this.anger);
        var curr = this.uiLayer.angerFire.length;
        if(prev == 4 && curr == 5) {
            this.explode();
        }
        else {
            this.scheduleOnce(this.resetPreserved, mushroom.duration);
        }

        this.removeMushroom();
        this.scheduleOnce(function() {mushroom.destroyMushroom();}, 0);
    },

    explode: function() {

    },

    stop: function() {
        this.getAnimation().stop();
    },

    cutEffect: function() {
        this.cutting.runAction()
    },

    stopAttack: function() {
        this.attacking = false;
        if( this.moving ) {
            this.walk();
            this.setDirection(this.target.x - this.getPosition().x);
        }
        else this.stand();
    },

    attack: function(pos) {
        this.attacking = true;
        this.unschedule(this.stopAttack);
        var now = Date.now();
        if(now - this.lastAttack > this.attackSpeed)
        {
            this.lastAttack = now;
            this.attackPos = pos;
            for(var i = 0, l = this.mushrooms.length; i < l; i++) {
                var mushroom = this.mushrooms[i];
                if(mushroom && mushroom.sisiAttacked) {
                    var ended = mushroom.sisiAttacked(this);
                    if(ended) {
                        this.removeMushroom(mushroom);
                    }
                }
            }
            this.scheduleOnce(this.slash,0.0016);
        }
        this.scheduleOnce(this.stopAttack, 0.8);
    },
    killedOne: function(enemy) {
        this.killed++;

        this.exp += enemy.exp;
        if(this.exp > this.levelup_exp) {
            this.setLevel(this.level+1);
            this.exp = 0;
            this.saveToLocal();
        }
        var score = this.levelBut - this.killed;
        this.uiLayer.setScore(score >= 0 ? score : 0);
        if(score <= 0) {
            GameController.gameScene.win();
        }
    },

    slash:function(){
        this.slashobj = new Slash(this.attackPos);
        this.getAnimation().play(["Attacking", this.moving ? "Walking" : "Standing"]);
    },
    walk: function() {
        this.getAnimation().play("Walking");
    },

    stand: function() {
        this.getAnimation().play("Standing");
    },

    attacked: function(power) {
        this.hp -= power;

        this.uiLayer.setBloodBarPercent(100 * this.hp / this.fullHp);
        if(this.hp < 0)
            this.falldown();
    },

    falldown: function() {
        GameController.gameScene.lost();
    },

    setDirection: function(x) {
        x < 0 ? this.setScaleX(-1) : this.setScaleX(1);
    },

    updateSisi: function() {
        // Control sprite's physic node
        // Apply force with speed
        var tar = this.target, pos = this.body.body.p;
        if(tar && cc.pDistance(pos,tar)>7)
        {
            this.body.targetMove(tar, this.moveSpeed);

        }
        else if(this.moving) {
            this.moving = false;
            this.target = null;
            //this.body.body.setVel(cc.p(0, 0));
            if(!this.attacking)
                this.stand();
        }
        this.setPosition(pos);
        this.setZOrder(-pos.y);
    }

});

var Slash = cc.Class.extend({

    ctor:function(pos){
        this.pbody = new PhysicsObject(1, 30, 1, pos);
        this.pbody.shape.setSensor(true);
        this.pbody.shape.setCollisionType(ATTACK_COL_TYPE);
        cc.Director.getInstance().getScheduler().scheduleCallbackForTarget(this,this.remove,0,0,0);
    },
    remove:function(){
        Physics.world.removeShape(this.pbody.shape);
        Physics.world.removeBody(this.pbody.body);
        //console.log("remove");
    }
});