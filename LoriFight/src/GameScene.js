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
    res: game_resources,

    // Layers
    ground: null,
    items: null,
    staticObjs: null,

    // Camera
    camera: null,

    // Object
    sisi: null,
    sisilayer: null,
    pointer: null,

    onEnter: function () {
        this._super();
        var layer = GameLayer.create(new cc.Color4B(0,0,255,80));
        layer.setContentSize(cc.size(400, 200));

        var winSize = cc.Director.getInstance().getWinSize();
        this.scheduleUpdate();
        this.debugNode = cc.PhysicsDebugNode.create(Physics.world);

        this.sisi = new Sisi();
        this.sisi.setPosition(winSize.width/2, winSize.height/2);
        this.sisi.setAnchorPoint(0.5, 0.5);
        this.sisi.body.setPosition(cc.p(winSize.width/2, winSize.height/2));

        this.sisilayer = new SisiLayer();
        this.sisilayer.setContentSize(winSize);
        this.sisilayer.setAnchorPoint(0, 0);
        this.sisilayer.setPosition(0, 0);
        this.sisilayer.setZOrder(2);
        this.sisilayer.setSisi(this.sisi);
        this.addChild(this.sisilayer);

        this.pointer = cc.DrawNode.create();
        var red = cc.c4f(1, 0, 0, 1);
        this.pointer.drawDot(cc.p(0, 0), 6, red);
        this.addChild(this.pointer);

        this.camera = new Camera(this.sisi, this);

        var gameMenuUI = new GameUILayer();
        gameMenuUI.init();
        this.addChild(gameMenuUI,5);

        // All layer add to camera
        this.addChild(this.debugNode);
        this.addChild(layer);
        //...
    },
    update:function()
    {
        Physics.update();
        EnemyController.update();

        this.sisi.update();

        this.camera.update();
    }
});