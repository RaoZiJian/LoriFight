/**
 * Created by panda on 12/20/13.
 */

var WinLayer = cc.LayerColor.extend({

    init: function(color)
    {
        this._super(color);

        var winSize = cc.Director.getInstance().getWinSize();
        this.setTouchEnabled(true);

        var menu = cc.Menu.create();
        this.addChild(menu, 1, 2);
        menu.setPosition(0, 0);

        var bg = cc.Sprite.create(s_win_winBgPic);
        bg.setPosition(winSize.width / 2, winSize.height / 2);
        this.addChild(bg,1,2);


        var startSp1 = cc.Sprite.create(s_win_star1);
        var startItem1 = cc.MenuItemSprite.create(startSp1,startSp1);
        startItem1.setCallback(function()
        {
            //cc.Director.getInstance().pushScene(GameController.gameScene);
        }, this);
        startItem1.setPosition(winSize.width / 2, winSize.height / 2);
        menu.addChild(startItem1,1,2);

        var startSp2 = cc.Sprite.create(s_win_star1);
        var startItem2 = cc.MenuItemSprite.create(startSp2,startSp2);
        startItem2.setCallback(function()
        {
            ;
        }, this);
        startItem1.setPosition(winSize.width / 2, winSize.height / 2);
        menu.addChild(startItem1,1,2);

        var startSp3 = cc.Sprite.create(s_win_star1);
        var startItem3 = cc.MenuItemSprite.create(startSp3,startSp3);
        startItem3.setCallback(function()
        {
            ;
        }, this);
        startItem3.setPosition(winSize.width / 2, winSize.height / 2);
        menu.addChild(startItem3,1,2);

        var startSp3 = cc.Sprite.create(s_logo);
        var startItem3 = cc.MenuItemSprite.create(startSp3,startSp3);
        startItem3.setCallback(function()
        {
           ;
        }, this);
        startItem3.setPosition(winSize.width / 2, winSize.height / 2);
        menu.addChild(startItem3,1,2);

        var rePlaySp = cc.Sprite.create(s_win_replay);
        var rePlayBtn = cc.MenuItemSprite.create(rePlaySp,rePlaySp);
        rePlayBtn.setCallback(function()
        {
            ;
        }, this);
        rePlayBtn.setPosition(winSize.width / 2, winSize.height / 2);
        menu.addChild(rePlayBtn,1,2);

        var nextSp = cc.Sprite.create(s_win_next);
        var nextBtn = cc.MenuItemSprite.create(nextSp,nextSp);
        nextBtn.setCallback(function()
        {
            ;
        }, this);
        nextBtn.setPosition(winSize.width / 2, winSize.height / 2);
        menu.addChild(nextBtn,1,2);

        return true;
    }

});

WinLayer.create = function (color) {
    var layer = new WinLayer();
    if (layer && layer.init(color)) {
        return layer;
    }
    return null;
};


var WinScene = BaseScene.extend({
    layer: null,

    res: menu_resources,

    onEnter: function () {
        this._super();
        this.layer = WinLayer.create(cc.c4b(255,0,0,255));
        this.addChild(this.layer);
    }
});