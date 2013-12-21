/**
 * Created by panda on 12/20/13.
 */
var ATTACK_COL_TYPE  = 20;


var Sisi = cc.Sprite.extend({

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

    skill: null,

    attackPos:null,
    ctor: function() {
        this._super();
        this.init(s_sisi, cc.rect(0, 0, 52, 110));
        this.body = new PhysicsObject(this.weight, this.radius, this.moveSpeed);
        this.body.shape.setCollisionType(10);
    },

    initWithConfig: function(config) {
        this.level = config.level;
        this.moveSpeed = config.speed;
        this.attackSpeed = config.speed;

        this.setPosition(config.pos);
        this.body.setPosition(config.pos);
        this.target = config.pos;

    },

    setTarget: function(tar) {
        this.target = tar;
        this.moving = true;
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
    },

    walk: function() {

    },

    stand: function() {

    },

    attacked: function() {

    },

    falldown: function() {

    },

    update: function() {
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