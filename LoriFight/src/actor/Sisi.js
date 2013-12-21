/**
 * Created by panda on 12/20/13.
 */

var Sisi = cc.Sprite.extend({

    level: 1,
    attack: 0,
    attackSpeed: 0,
    moveSpeed: 0,
    weight: 10,
    radius: 20,

    body: null,

    mushroom: null,

    skill: null,

    ctor: function() {
        this._super();
        this.init(s_sisi, cc.rect(0, 0, 52, 110));
        this.body = new PhysicsObject(this.weight, this.radius, this.moveSpeed);
    },

    initWithConfig: function(config) {
        this.level = config.level;
        this.moveSpeed = config.speed;
        this.attackSpeed = config.speed;

        this.setPosition(config.pos);
        this.body.setPosition(config.pos);

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


    attack: function() {

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
    }

});