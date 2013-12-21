/**
 * Created by panda on 12/21/13.
 */

var Camera = cc.Layer.extend({

    target: null,

    ctor: function(target) {
        this._super();
        this.init();

        var winSize = cc.Director.getInstance().getWinSize();
        this.setAnchorPoint(0.5, 0.5);
        this.setPosition(winSize.width/2, winSize.height/2);
        this.target = target;
        target.setAnchorPoint(0.5, 0.5);
        target.setPosition(0, 0);
        this.addChild(target);

        this.setTouchEnabled(true);
    },

    update: function() {
        var pos = this.target.getPosition(), x = pos.x, y = pos.y;
        if(x == 0 && y == 0)
            return;
        var children = this.getChildren();
        for(var i = 0, l = children.length; i < l; i++) {
            var child = children[i];
            if(child != this.target) {
                var cp = child.getPosition();
                child.setPosition(cp.x-x, cp.y-y);
            }
        }

        this.target.setPosition(0, 0);
    },

    onTouchesBegan: function(touches, event) {
        var pos = touches[0].getLocation();
        var targetpos = cc.pSub(pos, this.getPosition());
        this.target.setPosition(targetpos);
    }
});