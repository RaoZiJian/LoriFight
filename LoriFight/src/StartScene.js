/**
 * Created by panda on 12/20/13.
 */

var StartLayer = cc.LayerColor.extend({

    init: function(color,score)
    {
        this._super(color);

        var winSize = cc.Director.getInstance().getWinSize();
        this.setTouchEnabled(true);

        var menu = cc.Menu.create();
        this.addChild(menu, 10, 2);
        menu.setPosition(0, 0);


        var bg = cc.Sprite.create(s_win_startBg);
        bg.setPosition(winSize.width / 2, winSize.height / 2);
        this.addChild(bg,1,2);


        var startSp1 = cc.Sprite.create(s_win_startBtn);
        var startItem1 = cc.MenuItemSprite.create(startSp1,cc.Sprite.create(s_win_startBtn));
        startItem1.setCallback(function()
        {
            var action1 = cc.ScaleBy.create(0.2, 0.9, 0.9);
            startItem1.runAction(action1);
            var action2 = cc.ScaleBy.create(0.2, 1.0, 1.0);
            startItem1.runAction(action2);
            cc.Director.getInstance().pushScene(GameController.gameScene);
        }, this);
        startItem1.setPosition(winSize.width / 2.0, winSize.height / 3.1);
        menu.addChild(startItem1,1,2);

        return true;
    }
});

StartLayer.create = function (color) {
    var layer = new StartLayer();
    if (layer && layer.init(color)) {
        return layer;
    }
    return null;
};


var StartScene = BaseScene.extend({
    layer: null,

    res: menu_resources,

    onEnter: function () {
        this._super();
        this.layer = StartLayer.create(cc.c4b(255,0,0,255));
        this.addChild(this.layer);
    }
});
