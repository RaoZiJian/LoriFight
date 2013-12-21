/**
 * Created by panda on 12/21/13.
 */

var Camera = cc.Layer.extend({

    target: null,

    ctor: function(target) {
        this._super();
        this.init();

        this.target = target;

        this.setAnchorPoint(0.5, 0.5);
        this.setPosition(target.getPosition());

        this.setTouchEnabled(true);
    },

    update: function() {
        var tarpos = this.target.getPosition(), x = tarpos.x, y = tarpos.y,
            pos = this.getPosition(), dx = x - pos.x, dy = y - pos.y;
        if(dx == 0 && dy == 0)
            return;

        this.setPosition(tarpos);
    },

    onTouchesBegan: function(touches, event) {
        var pos = touches[0].getLocation();
        var targetpos = cc.pSub(pos, this.getPosition());
        this.target.setTarget(targetpos);
    }
});