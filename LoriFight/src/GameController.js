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
    menuScene: null,
    levelScene: null,
    gameScene: null,
    configScene: null,

    current: null,

    init: function(app) {
        this.app = app;
        this.menuScene = new MenuScene();
        this.levelScene = new LevelScene();
        this.gameScene = new GameScene();
        this.director = cc.Director.getInstance();
        Physics.init();
    },

    transitionToScene: function(scene) {
        //load resources
        var director = this.director;
        cc.LoaderScene.preload(scene.res, function () {
            director.replaceScene(scene);
        }, this.app);
    }
};

var CPSTEP = 1/60;
var Physics = {
    world:null,
    init:function(){
        var space = this.world = new cp.Space();
        space.iterations = 20;
        //space.gravity = cp.v(0, 0);//no gravity
        space.sleepTimeThreshold = 1;
        space.damping = 0.6;
        // comment this if does not work on JSB
        space.useSpatialHash(50,200);
        space.addCollisionHandler(10,ENEMY_COL_TYPE,function(a,b,c){
            var angle = cc.RADIANS_TO_DEGREES(cc.pToAngle(cc.pNeg(cc.p(a.contacts[0].n.x, a.contacts[0].n.y))));
            //TODO: player attack this angle
            console.log(angle);
            return true;
        });
    },
    update:function(){
        this.world.step(CPSTEP);
    }
};

var PhysicsObject = cc.Class.extend({
    body:null,
    shape:null,
    type:null,
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
    }
});