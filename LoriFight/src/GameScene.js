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

var CameraLayer = cc.Layer.extend({
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
    mapSize: cc.size(3000, 2500),
    mapSisiPos: cc.p(0, 0),
    mapNode:null,

    // Pause
    pause: false,

    slimeBatch:null,

    cutSprite: null,
    cutAction: null,
    cutting: false,
    fadeIn: null,
    fadeOut: null,
    preAction: null,
    postAction: null,

    // win layer
    winLayer: null,

    swap: false,

    onEnter: function () {
        // Load armature

        ccs.ArmatureDataManager.getInstance().addArmatureFileInfo(s_CCArmature_ExportJson);
        ccs.ArmatureDataManager.getInstance().addArmatureFileInfo(s_angry_json);

        cc.AudioEngine.getInstance().preloadSound(a_BKMusic_Mp3);
        cc.AudioEngine.getInstance().preloadSound(a_Zombie_Mp3);
        cc.AudioEngine.getInstance().playMusic(a_BKMusic_Mp3,true);

        this._super();

        var winSize = cc.Director.getInstance().getWinSize();
        var winMid = this.winMid = cc.p(winSize.width/2, winSize.height/2);
        this.debugNode = cc.PhysicsDebugNode.create(Physics.world);

        this.gameMenuUI = new GameUILayer();
        this.gameMenuUI.init();

        var camera = this.camera = new CameraLayer();
        this.addChild(camera);
        //camera.addChild(this.debugNode);
        camera.setPosition(winMid);
        var blur = cc.Sprite.create(s_blur);
        blur.setAnchorPoint(cc.p(0,0));
        this.addChild(blur,-99999);
/*        var layer = GameLayer.create(new cc.Color4B(0,0,255,40));
        layer.setContentSize(cc.size(400, 200));
        camera.addChild(layer);*/

        this.sisi = new Sisi();
        this.sisi.initialize();
        this.sisi.setPosition(0,0);
        this.sisi.body.setPosition(cc.p(0,0));
        camera.addChild(this.sisi);

        this.addChild(this.gameMenuUI, 5);

        this.slimeBatch = cc.SpriteBatchNode.create(s_slime_png);
        camera.addChild(this.slimeBatch);
        this.zombieBatch = cc.SpriteBatchNode.create(s_zombie_png);
        camera.addChild(this.zombieBatch);
        this.wolfBatch = cc.SpriteBatchNode.create(s_loup_png);
        camera.addChild(this.wolfBatch);

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


        this.cutSprite = new cc.Sprite.create(s_cut_png, cc.rect(0, 0, 143, 102));
        this.cutSprite.setOpacity(0);
        this.cutSprite._setZOrder(10000);
        this.cutSprite.setScaleX(-0.5, 0.5);
        this.cutSprite.setAnchorPoint(0.5, 0.5);

        this.fadeIn = cc.FadeIn.create(0.2);
        this.fadeOut = cc.FadeOut.create(0.1)
        this.preAction = cc.CallFunc.create(this.blockCut, this);
        this.postAction = cc.CallFunc.create(this.reactiveCut, this);
        this.fadeIn.retain();
        this.fadeOut.retain();
        this.preAction.retain();
        this.postAction.retain();
        this.cutAction = cc.Sequence.create( this.preAction,
            cc.Spawn.create(cc.ScaleTo.create(0.2, -1.2, 1.2), this.fadeIn),
            cc.Spawn.create(cc.ScaleTo.create(0.1, -1.4, 1.4), this.fadeOut),
            this.postAction );
        this.camera.addChild(this.cutSprite);

        this.setup(cc.size(3000,2500), cc.p(300, 200), 1, 3);

    },

    randomEnemies: function(w, h, origin, maxlvl) {
        //var pos = cc.pAdd( cc.p(Math.random() * w, Math.random() * h), cc.pNeg(origin) );
        w = w-200;
        h = h-200;
        var pos = cc.p(w*Math.random()-(w/2), h*Math.random()-(h/2));
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

    randomMashrooms: function(w, h) {
        this.swap = !this.swap;
        var mashroomClass = [GoldenMushroom, StickyMushroom, StickyMushroom, RoarMushroom, RoarMushroom, ShiftMushroom, VisibleMushroom, VisibleMushroom, VisibleMushroom];

            //var pos = cc.pAdd( cc.p(Math.random() * w, Math.random() * h), cc.pNeg(origin) );
        if(this.swap) {
            w = w-200;
            h = h-200;
            var pos = cc.p(w*Math.random()-(w/2), h*Math.random()-(h/2));
            var classid = Math.floor(Math.random() * 9);
            var type = mashroomClass[classid];

    //            this.enemies.push({'type': this.enemiesClass[classid],
    //                               'level': Math.ceil(Math.random()*maxlvl),
    //                               'pos': pos,
    //                               'count': count});
            var mashroom = new type(pos);
            this.camera.addChild(mashroom);
        }
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

            this.randomMashrooms(w, h);
        }
        var map =this.mapNode = new RandomMap(this.mapSize.width, this.mapSize.height);
        this.camera.addChild(map.rt, -5000);
    },

    addEnemies: function(type, level, pos, count) {
        new type(level, pos, count);
    },

    cutEffect: function() {
        if(!this.cutting) {
            var s = this.sisi.getScaleX() < 0 ? -1 : 1;
            this.cutAction = cc.Sequence.create( this.preAction,
                cc.Spawn.create(cc.ScaleTo.create(0.2, s * -1.2, 1.2), this.fadeIn),
                cc.Spawn.create(cc.ScaleTo.create(0.1, s * -1.4, 1.4), this.fadeOut),
                this.postAction );
            this.cutSprite.setScaleX( s * -0.5, 0.5);
            this.cutSprite.setPosition( cc.pAdd(this.sisi.getPosition(), cc.p( s * this.sisi.getContentSize().width/2, 0)) );
            this.cutSprite.runAction(this.cutAction);
        }
    },
    blockCut: function() {
        this.cutting = true;
    },
    reactiveCut: function() {
        this.cutting = false;
        this.cutSprite.setScale(-0.5, 0.5);
        this.cutSprite.setOpacity(0);
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
        var layer = new WinLayer();

        if (layer && layer.init(cc.c4b(0, 0, 0, 0), 9))
        {
            layer.setPosition(0, 0);
            layer.setAnchorPoint(0.5, 0.5);
            this.addChild(layer, 20000, 2);
        }
    },

    lost: function() {
        var layer = new FailLayer();

        if (layer && layer.init(cc.c4b(0, 0, 0, 0), 1))
        {
            layer.setPosition(0, 0);
            layer.setAnchorPoint(0.5, 0.5);
            this.addChild(layer, 20000, 2);
        }
    }
});