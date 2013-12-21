/**
 * Created by panda on 12/20/13.
 */

var Sisi = cc.Sprite.extend({

    level: 1,
    attack: 0,
    attackSpeed: 0,
    moveSpeed: 100,
    weight: 10,
    radius: 20,
    anger: 0,

    target: null,
    moving: false,

    body: null,

    mushroom: null,

    skill: null,

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


    attack: function(angle) {

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

var SisiLayer = cc.Layer.extend({
    sisi: null,

    ctor: function() {
        this._super();
        this.setTouchEnabled(true);
        this.scheduleUpdate();
    },

    setSisi: function(sisi) {
        this.sisi = sisi;
        this.addChild(this.sisi);
    },

    onTouchBegan: function(touch, event) {
        var pos = touch.getLocation();
        this.sisi.setTarget(cc.pSub(pos, GameController.gameScene.getPosition()));
    },
    update:function(){
        //get sisi location
        var sisipos = this.sisi.getPosition();
        this.setPosition(cc.pNeg(sisipos));
    }
});