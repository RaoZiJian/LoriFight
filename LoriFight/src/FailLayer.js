/**
 * Created by panda on 12/20/13.
 */

var FailLayer = cc.LayerColor.extend({

    init: function(color)
    {
        this._super(color);

        var winSize = cc.Director.getInstance().getWinSize();
        this.setTouchEnabled(true);

        var menu = cc.Menu.create();
        this.addChild(menu, 10, 2);
        menu.setPosition(0, 0);


        var bg = cc.Sprite.create(s_win_FailBg);
        bg.setPosition(winSize.width / 2, winSize.height / 2);
        this.addChild(bg,1,2);


        this.showPoint(9,this);


        var rePlaySp = cc.Sprite.create(s_win_replay);
        var rePlayBtn = cc.MenuItemSprite.create(rePlaySp,cc.Sprite.create(s_win_replay));
        rePlayBtn.setCallback(function()
        {
            ;
        }, this);
        rePlayBtn.setPosition(winSize.width / 2.2, winSize.height / 4);
        menu.addChild(rePlayBtn,1,2);

        var nextSp = cc.Sprite.create(s_win_next);
        var nextBtn = cc.MenuItemSprite.create(nextSp,cc.Sprite.create(s_win_next));
        nextBtn.setCallback(function()
        {
            ;
        }, this);
        nextBtn.setPosition(winSize.width / 1.8, winSize.height / 4);
        menu.addChild(nextBtn,1,2);

        return true;
    },
    showPoint : function(totalMasuNum,layer)
    {
        var winSize = cc.Director.getInstance().getWinSize();
        var num1;
        var num2;

        if(0 == totalMasuNum)
        {
            num1 = cc.Sprite.create(s_win_num0);
        }
        else if(1 == totalMasuNum)
        {
            num1 = cc.Sprite.create(s_win_num1);
        }
        else if(2 == totalMasuNum)
        {
            num1 = cc.Sprite.create(s_win_num2);
        }
        else if(3 == totalMasuNum)
        {
            num1 = cc.Sprite.create(s_win_num3);
        }
        else if(4 == totalMasuNum)
        {
            num1 = cc.Sprite.create(s_win_num4);
        }
        else if(5 == totalMasuNum)
        {
            num1 = cc.Sprite.create(s_win_num6);
        }
        else if(6 == totalMasuNum)
        {
            num1 = cc.Sprite.create(s_win_num6);
        }
        else if(7 == totalMasuNum)
        {
            num1 = cc.Sprite.create(s_win_num7);
        }
        else if(8 == totalMasuNum)
        {
            num1 = cc.Sprite.create(s_win_num8);
        }
        else if(9 == totalMasuNum)
        {
            num1 = cc.Sprite.create(s_win_num9);
        }
        num1.setPosition(winSize.width / 1.67, winSize.height / 2.8);
        layer.addChild(num1,300,2);


        if(0 == totalMasuNum)
        {
            num2 = cc.Sprite.create(s_win_num0);
        }
        else if(1 == totalMasuNum)
        {
            num2 = cc.Sprite.create(s_win_num1);
        }
        else if(2 == totalMasuNum)
        {
            num2 = cc.Sprite.create(s_win_num2);
        }
        else if(3 == totalMasuNum)
        {
            num2 = cc.Sprite.create(s_win_num3);
        }
        else if(4 == totalMasuNum)
        {
            num2 = cc.Sprite.create(s_win_num4);
        }
        else if(5 == totalMasuNum)
        {
            num2 = cc.Sprite.create(s_win_num6);
        }
        else if(6 == totalMasuNum)
        {
            num2 = cc.Sprite.create(s_win_num6);
        }
        else if(7 == totalMasuNum)
        {
            num2 = cc.Sprite.create(s_win_num7);
        }
        else if(8 == totalMasuNum)
        {
            num2 = cc.Sprite.create(s_win_num8);
        }
        else if(9 == totalMasuNum)
        {
            num2 = cc.Sprite.create(s_win_num9);
        }
        num2.setPosition(winSize.width / 1.57, winSize.height / 2.8);
        layer.addChild(num2,300,2);
    }

});

FailLayer.create = function (color) {
    var layer = new FailLayer();
    if (layer && layer.init(color)) {
        return layer;
    }
    return null;
};


var FailScene = BaseScene.extend({
    layer: null,

    res: menu_resources,

    onEnter: function () {
        this._super();
        this.layer = FailLayer.create(cc.c4b(255,0,0,255));
        this.addChild(this.layer);
    }
});
