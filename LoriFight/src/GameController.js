var BaseScene = cc.Scene.extend({
    controller: null,
    res: [],

    ctor: function() {
        this._super();
    }
});
var GameController ={
    app: null,
    director: null,
    startScene: null,
    menuScene: null,
    levelScene: null,
    gameScene: null,
    configScene: null,

    current: null,
    init: function(app) {
        this.app = app;
        this.startScene = new StartScene();
        this.menuScene = new MenuScene();
        this.levelScene = new LevelScene();
        this.gameScene = new GameScene();
        this.gameScene.retain();
        this.director = cc.Director.getInstance();
        Physics.init();
    },

    transitionToScene: function(scene) {
        //load resources
        var director = this.director;
        cc.LoaderScene.preload(scene.res, function () {
                            
            if (director.getRunningScene())
            {
                director.replaceScene(scene);
            }
            else
            {
                director.runWithScene(scene);
            }
        }, this.app);
    }
};

var CPSTEP = 1/60;
var Physics = {
    world:null,
    calculVector: function(a) {
        /*var s = a.a, d = a.b;
        var cs = cc.p((s.bb_b+s.bb_t)/2, (s.bb_l+s.bb_r)/2);
        var cd = cc.p((d.bb_b+d.bb_t)/2, (d.bb_l+d.bb_r)/2);
        */
        var n = a.getNormal(0);
        var v = cc.p(n.x, -n.y);
        return v;
    },
    calculAngle: function(a) {
        return cc.pToAngle( this.calculVector(a) );
    },

    init:function(){
        var space = this.world = new cp.Space();
        space.iterations = 20;
        //space.gravity = cp.v(0, 0);//no gravity
        space.sleepTimeThreshold = 1;
        space.damping = 0.025;
        // comment this if does not work on JSB
        space.useSpatialHash(50,200);
        var emptyFunction = function(){return true};

        space.addCollisionHandler(SISI_COL_TYPE, ENEMY_COL_TYPE,emptyFunction,function(a,b,c){
            var sisi = GameController.gameScene.sisi;
            var v = Physics.calculVector(a);
            sisi.setDirection(v.x);
            sisi.attack(a.getPoint(0));
            return true;
        },emptyFunction,emptyFunction);

        space.addCollisionHandler(ATTACK_COL_TYPE,ENEMY_COL_TYPE,function(a){
            var sisi = GameController.gameScene.sisi;
            var enemy = a.getShapes()[1].obj.view;
            var dir = Physics.calculAngle(a);
            var die = enemy.hurt(dir);
            if(die)
                sisi.killedOne(enemy);
            else
                enemy.attack();

            return true
        }, null, null,null);

        space.addCollisionHandler(SISI_COL_TYPE, MUSHROOM_COL_TYPE,function(a){
            var sisi = GameController.gameScene.sisi;
            var mushroom = a.getShapes()[1].obj.view;
            sisi.gotMushroom(mushroom);
        }.bind(this), null, null,null);
    },
    update:function(){
        this.world.step(CPSTEP);
    }
};
var StaticObjec = cc.Class.extend({
    ctor:function(radius,pos){
        this.shape = new cp.CircleShape(Physics.world.staticBody,radius, pos);
        Physics.world.addStaticShape(this.shape);
        this.shape.obj = this;
    }
});
var StaticObjec = cc.Class.extend({
    ctor:function(radius,pos){
        this.shape = new cp.CircleShape(Physics.world.staticBody,radius, pos);
        Physics.world.addStaticShape(this.shape);
        this.shape.obj = this;
    }
});
var PhysicsObject = cc.Class.extend({
    body:null,
    shape:null,
    type:null,
    view:null,
    ctor:function(weight, radius, maxSpeed, pos){
        this.body = new cp.Body(weight, cp.momentForCircle(weight, radius, 0, cp.v(0,0)));
        this.shape = new cp.CircleShape(this.body, radius, cp.v(0,0));
        Physics.world.addShape(this.shape);
        Physics.world.addBody(this.body);
        this.setMaxSpeed(maxSpeed);
        if(pos)
        {
            this.body.p = pos;
        }
        this.shape.obj = this;
    },
    setPosition:function(pos){
        this.body.setPos(pos);
    },
    //move towards a direction
    move:function(direction, force)
    {
        var v = cc.p(force,0);
        var impulse = cc.pRotateByAngle(v, cc.p(0,0), cc.DEGREES_TO_RADIANS(direction));
        this.body.applyImpulse(impulse, cp.v(0,0));
    },
    //move towards a point, regardless of where i am
    targetMove:function(point, force){
        var v = cc.p(force,0);
        var angle = cc.pToAngle(cc.pSub(point, this.body.p));
        var impulse = cc.pRotateByAngle(v, cc.p(0,0), angle);
        this.body.applyImpulse(impulse, cp.v(0,0));
    },
    setMaxSpeed:function(maxSpeed){
        this.body.v_limit = maxSpeed;
    },
    getPosition:function(){
        return this.body.p;
    },
    //so shape can find its parent object
    setView:function(v){
        this.view = v;
    }
});
var COLLISION_TYPE_FLOOR = 50;
var RandomMap = cc.Class.extend({
    rt:null,
    ctor:function(width, height){
        width = (width>4096)? 4096:width;
        height = (height>4096)? 4096: height;

        this.rt = cc.RenderTexture.create(width, height);
        //generate bondaries
        var staticBody = Physics.world.staticBody;
        var halfw = width/2;
        var halfh = height/2;
        var walls = [new cp.SegmentShape(staticBody, cp.v(-halfw, -halfh), cp.v(halfw, -halfh), 30), // bottom
            new cp.SegmentShape(staticBody, cp.v(-halfw, halfh), cp.v(halfw, halfh), 30), // top
            new cp.SegmentShape(staticBody, cp.v(-halfw, halfh), cp.v(-halfw, -halfh), 30), // left
            new cp.SegmentShape(staticBody, cp.v(halfw, halfh), cp.v(halfw, -halfh), 30)      // right
        ];
        for (var i = 0; i < walls.length; i++) {
            var wall = walls[i];
            wall.setElasticity(0);
            wall.setFriction(0);
            wall.setCollisionType(COLLISION_TYPE_FLOOR);
            Physics.world.addStaticShape(wall);
        }
        cc.SpriteFrameCache.getInstance().addSpriteFrames(ps_mapPlist,ps_mapPNG);
        var itemstrList = ["scene.psd_Psd.Dir/keng.png",
            "scene.psd_Psd.Dir/keng2.png",
            "scene.psd_Psd.Dir/dibanshikuai.png",
            "scene.psd_Psd.Dir/caopi.png",
            "scene.psd_Psd.Dir/caopi2.png",
            "scene.psd_Psd.Dir/caopi3.png",
            "scene.psd_Psd.Dir/caopi1.png",
            "scene.psd_Psd.Dir/caogu.png",
            "scene.psd_Psd.Dir/caogu2.png"];
        var itemList = [];
        var itemFreq = [15,15,5,1,1,1,1,8,8];
        for(var i = 0; i < itemstrList.length; i++)
        {
            itemList[i] = cc.Sprite.createWithSpriteFrameName(itemstrList[i]);
        }

        //draw the base map
        var tempSprite = cc.Sprite.create(map_base);
        //this.addChild(background, Z_MOUNTAINS , cc._p(0.2, 0.2), cc._p(0,-150));
        //tempSprite.getTexture().setTexParameters(gl.LINEAR, gl.LINEAR, gl.REPEAT, gl.CLAMP_TO_EDGE);
        this.rt.beginWithClear(0.27450980392157,0.30980392156863,0.23529411764706,1);
        //this.rt.setAnchorPoint(cc.p(0,0));
        this.rt.addChild(tempSprite);
        tempSprite.setVisible(true);
        tempSprite.setAnchorPoint(cc.p(0,0));
        for(var w=0; w < width; w+=128)
        {
            for(var h=0; h < height; h+=128)
            {
                tempSprite.setPosition(w,h);
                tempSprite.visit();
            }
        }


        for(var i = 0; i < itemList.length; i ++)
        {
            for(var k = 0; k < itemFreq[i]; k++)
            {
                itemList[i].setPosition(Math.random()*width, Math.random()*height);
                itemList[i].visit();
            }
        }



        this.rt.end();
        tempSprite.removeFromParent();
        this.generateObstacles(width, height);

    },
    generateObstacles:function(width, height){
        var cam = GameController.gameScene.camera;

        for(var i = 0; i < 50; i++)
        {
            var tree = cc.Sprite.createWithSpriteFrameName("scene.psd_Psd.Dir/yingguanmu2.png");
            cam.addChild(tree);
            var x = Math.random()*width-width/2;
            var y = Math.random()*height-height/2;
            tree.setPosition(x,y);
            tree.setZOrder(-y);
            new StaticObjec(85,cc.p(x,y));
        }
    }
});

