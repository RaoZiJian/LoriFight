/**
 * Created by panda on 12/20/13.
 */

var MenuLayer = cc.LayerColor.extend({

    sisi: null,

    init: function(color) {
        this._super(color);

        this.sisi = new Sisi();
        this.sisi.setPosition(100, 100);
        this.addChild(this.sisi);

        this.setTouchEnabled(true);
        this.setMouseEnabled(true);

        return true;
    },

    onTouchBegan: function(touch, event) {
        //gameController.transitionToScene(gameController.gameScene);
    },

    onMouseDown: function() {
        //gameController.transitionToScene(gameController.gameScene);
    },

    onTouchMoved: function(touch, event) {
    },

    onTouchEnded: function(touch, event) {
    }
});
MenuLayer.create = function (color) {
    var layer = new MenuLayer();
    if (layer && layer.init(color)) {
        return layer;
    }
    return null;
};


var MenuScene = BaseScene.extend({
    layer: null,

    res: menu_resources,

    onEnter: function () {
        this._super();
        this.layer = MenuLayer.create(new cc.Color4B(255,0,0,255));
        this.addChild(this.layer);
    }
});