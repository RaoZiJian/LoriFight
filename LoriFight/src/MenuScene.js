/**
 * Created by panda on 12/20/13.
 */

var MenuLayer = cc.LayerColor.extend({

    init: function(color) {
        this._super(color);

        var winSize = cc.Director.getInstance().getWinSize();
        this.setTouchEnabled(true);

        var menu = cc.Menu.create();
        this.addChild(menu, 1, 2);
        menu.setPosition(0, 0);

        var logo = cc.Sprite.create(s_logo);
        var enterGame = cc.MenuItemSprite.create(logo,cc.Sprite.create(s_logo));
        enterGame.setCallback(function(){
            cc.Director.getInstance().pushScene(GameController.menuScene);
        }, this);
        enterGame.setPosition(winSize.width / 2, winSize.height / 2);

        menu.addChild(enterGame,1,2);

        return true;
    },

    onTouchesBegan: function(touch, event) {

    },

    onTouchesMoved: function(touch, event) {
    },

    onTouchesEnded: function(touch, event) {
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
        this.layer = MenuLayer.create(cc.c4b(255,0,0,255));
        this.addChild(this.layer);
    }
});