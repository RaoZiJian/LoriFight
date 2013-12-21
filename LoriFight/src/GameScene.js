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

        this.scheduleUpdate();
        this.debugNode = cc.PhysicsDebugNode.create(Physics.world);

        this.sisi = new Sisi();

        // Sisi will be added automatically
        this.camera = new Camera(this.sisi, this);

        // All layer add to camera
        this.camera.addChild(this.debugNode);
        this.camera.addChild(layer);
        //...

        this.addChild(this.camera);
    },
    update:function()
    {
        Physics.update();

        this.camera.update();
    }
});