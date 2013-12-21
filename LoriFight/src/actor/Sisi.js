/**
 * Created by panda on 12/20/13.
 */
var ATTACK_COL_TYPE  = 20;

var Sisi = ccs.Armature.extend({

    level: 1,
    exp: 0,
    hp: 500,
    fullHp: 500,
    power: 50,
    attackSpeed: 500,
    lastAttack:0,
    moveSpeed: 200,
    weight: 10,
    radius: 20,
    anger: 0,

    target: null,
    moving: false,
    attacking: false,

    uiLayer: null,

    body: null,

    mushroom: null,
    emotion: null,

    skill: null,

    attackPos:null,
    ctor: function() {
        this._super();

        //this.init(s_sisi, cc.rect(0, 0, 52, 110));
        this.init("CCArmature");

        this.uiLayer = GameController.gameScene.gameMenuUI;

        this.body = new PhysicsObject(this.weight, this.radius, this.moveSpeed);
        this.body.shape.setCollisionType(10);
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

    gotMushroom: function(mushroom) {
        this.mushroom = mushroom;
        mushroom.trigger();
        this.anger += mushroom.anger;

        var prev = this.uiLayer.angerFire.length;
        this.uiLayer.setAngerExpression(this.anger);
        var curr = this.uiLayer.angerFire.length;
        if(prev == 4 && curr == 5)
            this.explode();
    },

    explode: function() {

    },

    stop: function() {
        this.getAnimation().stop();
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
            this.scheduleOnce(this.slash,0);
        }
        this.scheduleOnce(this.stopAttack, 0.8);
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
        else{
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

var Slash = cc.Node.extend({

    ctor:function(pos){
        this.pbody = new PhysicsObject(1, 30, 1, pos);
        this.pbody.shape.setSensor(true);
        this.pbody.shape.setCollisionType(ATTACK_COL_TYPE);
        cc.Director.getInstance().getScheduler().scheduleCallbackForTarget(this,this.remove,0,0,0.2);
    },
    remove:function(){
        Physics.world.removeShape(this.pbody.shape);
        Physics.world.removeBody(this.pbody.body);
        //console.log("remove");
    }
});