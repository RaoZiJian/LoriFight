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

var CameraLayer = cc.LayerColor.extend({
    ctor:function(c4b){
        this._super();
        this.init(c4b);
        this.setTouchEnabled(true);
    },
    onTouchesBegan:function(touch){
        var pos = touch[0].getLocation();
    
        GameController.gameScene.sisi.setTarget(cc.pSub(pos,this.getPosition()));
    }
});


var GameScene = BaseScene.extend({
    res: game_resources,

    // Layers
    ground: null,
    items: null,
    staticObjs: null,
    gameMenuUI: null,

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

        this.gameMenuUI = new GameUILayer();
        this.gameMenuUI.init();

        var camera = this.camera = new CameraLayer(cc.c4b(0,255,0,30));
        this.addChild(camera);
        //camera.addChild(this.debugNode);
        camera.setPosition(winMid);

/*        var layer = GameLayer.create(new cc.Color4B(0,0,255,40));
        layer.setContentSize(cc.size(400, 200));
        camera.addChild(layer);*/

        this.sisi = new Sisi();
        this.sisi.setPosition(0,0);
        this.sisi.body.setPosition(cc.p(0,0));
        camera.addChild(this.sisi);

        this.addChild(this.gameMenuUI, 5);

        this.pause = false;

        var test = new ZombieLeader(5,cc.p(200,400), 30);
        var shinningMushroom = new goldenMushroom(cc.p(200,300));
        shinningMushroom.trigger(100);
        this.camera.addChild(shinningMushroom);
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

});