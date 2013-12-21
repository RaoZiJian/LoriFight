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
    // Layers
    ground: null,
    items: null,
    staticObjs: null,

    // Camera
    camera: null,

    res: game_resources,
    sisi: null,

    onEnter: function () {
        this._super();
        var layer = GameLayer.create(new cc.Color4B(0,0,255,255));
        this.addChild(layer);
        this.scheduleUpdate();
        this.debugNode = cc.PhysicsDebugNode.create(Physics.world);
        this.addChild(this.debugNode);

        this.sisi = new Sisi();

        this.camera = new Camera(this.sisi, this);
    },
    update:function()
    {
        Physics.update();

        this.camera.update();
    }
});