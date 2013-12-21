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

        if(this.target.x < this.getPosition().x)
            this.setScaleX(-1);
        else
            this.setScaleX(1);

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

    attack: function(pos) {
        var now = Date.now();
        if(now - this.lastAttack > this.attackSpeed)
        {
            this.lastAttack = now;
            this.attackPos = pos;
            this.scheduleOnce(this.slash,0);
        }
    },
    slash:function(){
        this.slashobj = new Slash(this.attackPos);
        this.getAnimation().play(["Attacking", "Standing"]);
    },

    walk: function() {
        this.getAnimation().play("Walking");
    },

    stand: function(delay, duration) {
        this.getAnimation().play("Standing", delay, duration);
    },

    attacked: function() {

    },

    falldown: function() {

    },

    updateSisi: function() {
        // Control sprite's physic node
        // Apply force with speed
        var tar = this.target, pos;
        if(this.moving && tar) {
            this.body.targetMove(tar, this.moveSpeed);

            pos = this.body.body.p;
            if(cc.pDistance(pos,tar)<5) {
                this.moving = false;
                this.body.body.setVel(cc.p(0, 0));
            }
        }
        else pos = this.body.body.p;

        this.setPosition(pos);
    }

});

var Slash = cc.Node.extend({

    ctor:function(pos){
        this.pbody = new PhysicsObject(1, 20, 1, pos);
        this.pbody.shape.setSensor(true);
        this.pbody.shape.setCollisionType(ATTACK_COL_TYPE);
        cc.Director.getInstance().getScheduler().scheduleCallbackForTarget(this,this.remove,0,0,0.2);
    },
    remove:function(){
        Physics.world.removeShape(this.pbody.shape);
        Physics.world.removeBody(this.pbody.body);
        console.log("remove");
    }
});