/**
 * Created by panda on 12/21/13.
 */

var Camera = cc.Class.extend({

    target: null,
    scene: null,
    prevPos: null,
    winCenter: null,

    ctor: function(target, scene) {
        this.scene = scene;
        this.target = target;
        this.prevPos = this.target.getPosition();
        var winSize = cc.Director.getInstance().getWinSize();
        this.winCenter = cc.p(winSize.width/2, winSize.height/2);
    },

    update: function() {
        var currPos = cc.pAdd(this.target.getPosition(), this.scene.getPosition());
        var dpos = cc.pSub(this.winCenter, currPos);
        this.scene.setPosition(cc.pAdd(this.scene.getPosition(), dpos));
    }
});