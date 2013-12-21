/**
 * Created by panda on 12/20/13.
 */

var GameLayer = cc.LayerColor.extend({

    init: function(color) {
        this._super(color);

        return true;
    }
});
GameLayer.create = function (color) {
    var layer = new GameLayer();
    if (layer && layer.init(color)) {
        return layer;
    }
    return null;
};


var GameScene = BaseScene.extend({
    layer: null,

    res: game_resources,

    onEnter: function () {
        this._super();
        this.layer = GameLayer.create(new cc.Color4B(0,0,255,255));
        this.addChild(this.layer);
        this.scheduleUpdate();
    },
    update:function()
    {
        Physics.update();
    }
});