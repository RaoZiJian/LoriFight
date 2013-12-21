/**
 * Created by panda on 12/20/13.
 */

var LevelLayer = cc.LayerColor.extend({

    init: function(color) {
        this._super(color);

        return true;
    }
});
LevelLayer.create = function (color) {
    var layer = new LevelLayer();
    if (layer && layer.init(color)) {
        return layer;
    }
    return null;
};


var LevelScene = BaseScene.extend({
    layer: null,

    res: level_resources,

    onEnter: function () {
        this._super();
        this.layer = LevelLayer.create(new cc.Color4B(0,255,0,255));
        this.addChild(this.layer);
    }
});