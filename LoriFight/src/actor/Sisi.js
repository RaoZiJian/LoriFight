/**
 * Created by panda on 12/20/13.
 */

var Sisi = Actor.extend({

    movementShift: cc.p(0, 0),

    physic_node: null,

    mushroom: null,

    skill: null,

    ctor: function() {
        this._super(s_sisi, cc.rect(0, 0, 52, 110));
    },

    initWithConfig: function(config) {
        this.level = config.level;
        this.moveSpeed = config.speed;
        this.attackSpeed = config.speed;
    },

    setMoveSpeed: function(speed) {
        this.moveSpeed = speed;
    },

    setAttackSpeed: function(speed) {
        this.attackSpeed = speed;
    },

    setMovementShift: function(x, y) {
        this.movementShift.x = x;
        this.movementShift.y = y;
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