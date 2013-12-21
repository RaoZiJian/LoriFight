/**
 * Created by panda on 12/20/13.
 */

var Sisi = ccs.Armature.extend({

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
    emotion: null,

    skill: null,

    ctor: function() {
        this._super();

        //this.init(s_sisi, cc.rect(0, 0, 52, 110));
        this.init("CCArmature");
        this.getAnimation().play("Walking");
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

var SisiLayer = cc.Layer.extend({
    sisi: null,

    ctor: function() {
        this._super();
        thi
        this.scheduleUpdate();s.setTouchEnabled(true);
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