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
    onTouchBegan:function(){},
    onTouchesBegan:function(touch){
        var pos = touch[0].getLocation();
    
        GameController.gameScene.sisi.setTarget(cc.pSub(pos,this.getPosition()));
    }
});

/*var ResultLayer = cc.Layer.extend({
    panel: null,
    cry: null,
    happy: null,
    title: null,
    nextBtn: null,
    replayBtn: null,
    mushroomtxt: null,

    ctor: function() {
        this._super();
        this.init();

        this.panel = cc.Sprite.initWithFile(s_result_panel, cc.rect(0, 0, 760, 422));
        this.head = cc.Sprite.initWithFile(s_cry_png, cc.rect(0, 0, 760, 422));
    }
});*/


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

        var shinningMushroom = new GoldenMushroom(cc.p(200,300));
        this.camera.addChild(shinningMushroom);

        var sticky = new StickyMushroom(cc.p(400,500));
        this.camera.addChild(sticky);
        this.scheduleUpdate();

        var roar = new RoarMushroom(cc.p(500,300));
        this.camera.addChild(roar);

        var visible = new VisibleMushroom(cc.p(100,300));
        this.camera.addChild(visible);

        var shift = new ShiftMushroom(cc.p(100,533));
        this.camera.addChild(shift);

        this.setup(cc.size(960, 640), cc.p(300, 200), 1, 3);

    },

    randomEnemies: function(w, h, origin, maxlvl) {
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

//            this.enemies.push({'type': this.enemiesClass[classid],
//                               'level': Math.ceil(Math.random()*maxlvl),
//                               'pos': pos,
//                               'count': count});
        this.addEnemies(this.enemiesClass[classid], Math.ceil(Math.random()*maxlvl), pos, count);
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
            this.randomEnemies(w, h, origin, maxlvl);
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
            var camPos = cc.pAdd(cc.pNeg(sisipos), this.winMid);
            this.camera.setPosition(camPos);

            var sisiPos = this.sisi.getPosition();
            // Add new enemies
            if(EnemyActive.length < 10 && EnemyLeaderContainer.length < 2) {
                var pos = cc.p(0, 0);
                pos.x = sisiPos.x + (Math.random()>0.5 ? 1 : -1) * (Math.random() * 100 + this.winMid.x);
                pos.y = sisiPos.y + (Math.random()>0.5 ? 1 : -1) * (Math.random() * 100 + this.winMid.y);
                this.randomEnemies(this.mapSize.width, this.mapSize.height, pos, this.sisi.level);
            }
        }
    },

    win: function() {

    },

    lost: function() {

    }
});