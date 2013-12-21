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
    difficult: 1,

    // Enemies
    enemies: null,
    enemiesClass: [SlimeLeader, WolfLeader, ZombieLeader],

    // Camera
    camera: null,
    sisi: null,
    winMid: null,
    mapSize: cc.size(0, 0),
    mapSisiPos: cc.p(0, 0),

    // Pause
    pause: false,

    onEnter: function () {
        // Load armature
        ccs.ArmatureDataManager.getInstance().addArmatureFileInfo(s_CCArmature_ExportJson);

        this._super();

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

        var shinningMushroom = new goldenMushroom(cc.p(200,300));
        shinningMushroom.trigger();
        this.camera.addChild(shinningMushroom);

        var sticky = new stickyMushroom(cc.p(400,500));
        sticky.trigger();
        this.camera.addChild(sticky);
        this.scheduleUpdate();

        this.setup(cc.size(960 * 2, 640 * 2), cc.p(300, 200), 1, 3);

    },

    setup: function(size, sisiPos, difficult, maxlvl) {
        this.mapSize = size;
        this.mapSisiPos = sisiPos;
        this.difficult = difficult;

        var origin = cc.pSub(sisiPos, this.sisi.getPosition());

        var w = size.width, h = size.height;
        var nb = (w * h / (960*640)) * this.difficult;
        if(nb == 0) nb = 1;
        for(var i = 0; i < nb; ++i) {
            var pos = cc.pAdd( cc.p(Math.random() * w, Math.random() * h), origin );

            var classid = Math.floor(Math.random() * 3);
            var count;
            if(classid == 0) {
                count = Math.round(Math.random() * 50);
            }
            else if(classid == 1) {
                count = Math.round(Math.random() * 30);
            }
            else {
                count = Math.round(Math.random() * 20);
            }

            this.addEnemies(this.enemiesClass[classid], Math.ceil(Math.random()*maxlvl), pos, count);
        }
    },

    addEnemies: function(type, level, pos, count) {
        new type(level, pos, count);
    },

    update:function()
    {
        if(!this.pause) {
            Physics.update();
            EnemyController.update();

            this.sisi.updateSisi();
            var sisipos = this.sisi.getPosition();
            this.camera.setPosition(cc.pAdd(cc.pNeg(sisipos), this.winMid));
        }
    }
});