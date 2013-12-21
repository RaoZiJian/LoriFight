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
    sisi: null,
    winMid:null,

    // Pause
    pause: false,

    onEnter: function () {
        // Load armature
        ccs.ArmatureDataManager.getInstance().addArmatureFileInfo(s_CCArmature_ExportJson);

        this._super();
        this.scheduleUpdate();
        var winSize = cc.Director.getInstance().getWinSize();
        var winMid = this.winMid = cc.p(winSize.width/2, winSize.height/2);
        this.debugNode = cc.PhysicsDebugNode.create(Physics.world);

        var camera = this.camera = cc.LayerColor.create(cc.c4b(0,255,0,30));
        this.addChild(camera);
        //camera.addChild(this.debugNode);
        camera.setPosition(winMid);

/*        var layer = GameLayer.create(new cc.Color4B(0,0,255,40));
        layer.setContentSize(cc.size(400, 200));
        camera.addChild(layer);*/

        this.sisi = new Sisi();
        this.sisi.setPosition(0,0);
        //this.sisi.setAnchorPoint(0.5, 0.5);
        this.sisi.body.setPosition(cc.p(0,0));
        camera.addChild(this.sisi);

/*        var sisilayer = new SisiLayer();
        sisilayer.setContentSize(winSize);
        sisilayer.setAnchorPoint(0, 0);
        sisilayer.setPosition(0, 0);
        sisilayer.setZOrder(2);
        sisilayer.setSisi(this.sisi);
        this.addChild(sisilayer);*/

        //this.camera = new Camera(this.sisi, this);

        var gameMenuUI = new GameUILayer();
        gameMenuUI.init();
        this.addChild(gameMenuUI,5);
        //...

        camera.setTouchEnabled(true);
        camera.onTouchBegan = this.onTouchBegan.bind(this);

        this.pause = false;

        var test = new SlimeLeader(5,cc.p(200,400), 30)
    },

    update:function()
    {
        if(!this.pause) {
            Physics.update();
            EnemyController.update();

            this.sisi.updateSisi();
            var sisipos = this.sisi.getPosition();
            this.camera.setPosition(cc.pAdd(cc.pNeg(sisipos), this.winMid));

            //this.camera.update();
        }
    },
    onTouchBegan:function(touch){
        var pos = touch.getLocation();
        this.sisi.setTarget(cc.pSub(pos,this.camera.getPosition()));
    }
});