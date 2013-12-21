/**
 * Created by panda on 12/20/13.
 */

var MUSHROOM_COL_TYPE = 40;

var goldenMushroom = cc.Sprite.extend({

    weight: 500,
    radius: 20,

    name:null,
    texture:null,
    duration:null,
    angerValue:null,

    // physique
    body: null,

    attackTimes:null,

    ctor:function(pos){
        this._super();
        this.body = new PhysicsObject(this.weight, this.radius, 0, pos);
        this.body.setView(this);
        this.body.shape.setSensor(true);
        this.body.shape.setCollisionType(MUSHROOM_COL_TYPE);

        this.setPosition(pos);

        var mushroom = cc.SpriteBatchNode.create(s_ShineMushroom_Png);
        this.initWithTexture(mushroom.getTexture(), cc.rect(0, 0, 50, 57), false);
        this.name = "golden";
        this.duration = 0;
        this.angerValue = 30;
    },

    trigger:function(){
        this.attackTimes = 0;
    },

    sisiAttacked:function(sisi){

        this.attackTimes++;
        GameController.gameScene.gameMenuUI.setShinningLevel(240);
        if(this.attackTimes>5){
            GameController.gameScene.gameMenuUI.setShinningLevel(0);
            return true;
        }else{
            return false;
        }
    },

    destroyMushroom:function(){
        this.removeFromParent();
        Physics.world.removeShape(this.body.shape);
        Physics.world.removeBody(this.body.body);
    }
  });

var stickyMushroom = cc.Sprite.extend({

    weight: 500,
    radius: 20,

    name:null,
    texture:null,
    duration:null,
    angerValue:null,

    // physique
    body: null,

   ctor:function(pos){
       this._super(pos);
       this.name = "sticky";
       this.duration = 30;

       var mushroom = cc.SpriteBatchNode.create(s_StickyMushroom_Png);
       this.initWithTexture(mushroom, cc.rect(0, 0, 50, 54), false);
       this.angerValue = 40;
   },

   trigger:function(){

       var sisiLocal = GameController.gameScene.sisi;
       sisiLocal.setMoveSpeed(0.5 * sisiLocal.moveSpeed);
       sisiLocal.setAttackSpeed(0.5 * sisiLocal.attackSpeed);
   },

    destroyMushroom:function(){
        this.removeFromParent();
        Physics.world.removeShape(this.body.shape);
        Physics.world.removeBody(this.body.body);
    }
});

var roarMushroom = cc.Sprite.extend({
    weight: 500,
    radius: 20,

    name:null,
    texture:null,
    duration:null,
    angerValue:null,

    // physique
    body: null,

    ctor:function(pos){
        this._super(pos);
        this.name = "roar";
        this.duration = 30;
        var mushroom = cc.SpriteBatchNode.create(s_RoarMushroom_Png);
        this.initWithTexture(mushroom, cc.rect(0, 0, 50, 53), false);
        this.angerValue = 50;
    },

    trigger:function(){

        this.roarWerewolf();
    },

    roarWerewolf:function(){


    },

    destroyMushroom:function(){
        this.removeFromParent();
        Physics.world.removeShape(this.body.shape);
        Physics.world.removeBody(this.body.body);
    }
});

var shiftMushroom = cc.Sprite.extend({
    weight: 500,
    radius: 20,

    name:null,
    texture:null,
    duration:null,
    angerValue:null,

    // physique
    body: null,

    shiftType:null,

    ctor:function(pos, type){

        this._super(pos);
        this.name = "shift";
        this.duration = 30;
        this.shiftType = type;
        this.angerValue = 30;
        if(this.shiftType == "acute"){
            var mushroom = cc.SpriteBatchNode.create(s_AcuteMushroom_Png);
            this.initWithTexture(mushroom, cc.rect(0, 0, 41, 66), false);
        }else if(this.shiftType == "slow"){
            var mushroom = cc.SpriteBatchNode.create(s_SlowMushroom_Png);
            this.initWithTexture(mushroom, cc.rect(0, 0, 47, 60), false);
        }
    },

    trigger:function(){

      this.movementShift();
    },

    movementShift:function(){

        if(this.shiftType == "acute"){

        }else if(this.shiftType == "slow"){

        }
    },

    destroyMushroom:function(){
        this.removeFromParent();
        Physics.world.removeShape(this.body.shape);
        Physics.world.removeBody(this.body.body);
    }
});

var visibleMushroom = cc.Sprite.extend({
    weight: 500,
    radius: 20,

    name:null,
    texture:null,
    duration:null,
    angerValue:null,

    // physique
    body: null,

    ctor:function(pos){
        this._super(pos);
        this.angerValue = 60;
        this.name = "visible";
        this.duration = 9999999999;
        var mushroom = cc.SpriteBatchNode.create(s_VisibleMushroom_Png);
        this.initWithTexture(mushroom, cc.rect(0, 0, 52, 60), false);
    },

    trigger:function(){

    },

    destroyMushroom:function(){
        this.removeFromParent();
        Physics.world.removeShape(this.body.shape);
        Physics.world.removeBody(this.body.body);
    }
})


