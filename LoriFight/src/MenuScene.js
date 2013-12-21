/**
 * Created by panda on 12/20/13.
 */

var MenuLayer = cc.LayerColor.extend({

    init: function(color) {
        this._super(color);

        var winSize = cc.Director.getInstance().getWinSize();
        var logo = cc.Sprite.create(s_logo);

        var enterGame = cc.MenuItemSprite.create(logo);
        enterGame.setCallback(function(){
            gameController.transitionToScene(gameController.gameScene);
        }, this);
        var menu = cc.Menu.create(enterGame);
        menu.alignItemsVerticallyWithPadding(10);
        this.addChild(menu, 1, 2);
        menu.setPosition(winSize.width / 2, winSize.height / 2);

        this.setTouchEnabled(true);
        this.setMouseEnabled(true);

        return true;
    },

    onTouchBegan: function(touch, event) {
    },

    onMouseDown: function() {
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