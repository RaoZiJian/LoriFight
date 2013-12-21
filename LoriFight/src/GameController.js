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
        space.sleepTimeThreshold = 0.1;
        space.damping = 0.5;
        // comment this if does not work on JSB
        space.useSpatialHash(50,200);
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
        return impulse;
    },
    //move towards a point, regardless of where i am
    targetMove:function(point, force){
        var angle = cc.pSub(point, this.body.p);

    },
    setMaxSpeed:function(maxSpeed){
        this.body.v_limit = maxSpeed;
    }
});