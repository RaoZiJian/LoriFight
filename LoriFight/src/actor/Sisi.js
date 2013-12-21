/**
 * Created by panda on 12/20/13.
 */
var ATTACK_COL_TYPE  = 20;

var Sisi = ccs.Armature.extend({

    level: 1,
    attack: 0,
    attackSpeed: 300,
    lastAttack:0,
    moveSpeed: 100,
    weight: 10,
    radius: 20,
    anger: 0,

    target: null,
    moving: false,
    attacking: false,

    body: null,

    mushroom: null,
    emotion: null,

    skill: null,

    attackPos:null,
    ctor: function() {
        this._super();

        //this.init(s_sisi, cc.rect(0, 0, 52, 110));
        this.init("CCArmature");

        this.body = new PhysicsObject(this.weight, this.radius, this.moveSpeed);
        this.body.shape.setCollisionType(10);
    },

    showEmotion: function(emotion) {
        if(!this.emotion) {
            this.emotion = emotion;
            emotion.setAnchorPoint(0.5, 0);
            var size = this.getContentSize();
            emotion.setPosition(size.width/2, size.height + 10);
            this.addChild(emotion, "emotion");
            this.schedule(this.removeEmotion, 3);
        }
    },

    removeEmotion: function() {
        this.removeChildByTag("emotion");
    },

    setTarget: function(tar) {
        this.target = tar;
        this.moving = true;

        this.setDirection(this.target.x - this.getPosition().x);

        this.walk();
    },

    setMoveSpeed: function(speed) {
        this.moveSpeed = speed;
    },

    setAttackSpeed: function(speed) {
        this.attackSpeed = speed;
    },

    setMushroom: function(mushroom) {
        this.mushroom = mushroom;
        mushroom.trigger();
    },

    stop: function() {
        this.getAnimation().stop();
    },

    stopAttack: function() {
        this.attacking = false;
        this.moving ? this.walk() : this.stand();
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
        this.scheduleOnce(this.stopAttack, 1.5);
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

    attacked: function() {

    },

    falldown: function() {

    },

    setDirection: function(x) {
        x < 0 ? this.setScaleX(-1) : this.setScaleX(1);
    },

    updateSisi: function() {
        // Control sprite's physic node
        // Apply force with speed
        var tar = this.target, pos;
        if(!this.attacking && this.moving && tar) {
            this.body.targetMove(tar, this.moveSpeed);

            pos = this.body.body.p;
            if(cc.pDistance(pos,tar)<5) {
                this.moving = false;
                this.body.body.setVel(cc.p(0, 0));
                this.stand();
            }
        }
        else pos = this.body.body.p;

        this.setPosition(pos);
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