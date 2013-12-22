/**
 * Created by panda on 12/20/13.
 */

var MUSHROOM_COL_TYPE = 40;

var ItemSprite = cc.Sprite.extend({
    weight: 500,
    radius: 20,

    name:null,
    texture:null,
    duration:null,
    angerValue:null,

    // physique
    body: null,

    ctor:function(pos){
        this._super();

        this.body = new PhysicsObject(this.weight, this.radius, 0, pos);
        this.body.setView(this);
        this.body.shape.setSensor(true);
        this.body.shape.setCollisionType(MUSHROOM_COL_TYPE);

        this.setPosition(pos);
    },

    trigger:function(){
        this.attackTimes = 0;
    },

    destroyMushroom:function(){
        this.removeFromParent();
        Physics.world.removeShape(this.body.shape);
        Physics.world.removeBody(this.body.body);
    }
});

var GoldenMushroom = ItemSprite.extend({
    attackTimes:null,

    duration: 0,
    name: "golden",
    angerValue: 30,
    waitCancel: false,

    ctor:function(pos){
        this._super(pos);

        var mushroom = cc.SpriteBatchNode.create(s_ShineMushroom_Png, 1);
        this.initWithTexture(mushroom.getTexture(), cc.rect(0, 0, 50, 57), false);
    },

    trigger:function(){
        this.attackTimes = 0;
    },

    sisiAttacked:function(sisi){

        this.attackTimes++;
        this.waitCancel = true;
        GameController.gameScene.gameMenuUI.setShinningLevel(100 + this.attackTimes*10);

        if(this.attackTimes>30){
            return true;
        }else{
            return false;
        }
    }
  });

var StickyMushroom = cc.Sprite.extend({

    weight: 500,
    radius: 20,

    name:null,
    texture:null,
    duration:null,
    angerValue:null,

    // physique
    body: null,

   ctor:function(pos){
       this._super();
       this.body = new PhysicsObject(this.weight, this.radius, 0, pos);
       this.body.setView(this);
       this.body.shape.setSensor(true);
       this.body.shape.setCollisionType(MUSHROOM_COL_TYPE);

       this.setPosition(pos);

       this.name = "sticky";
       this.duration = 30;

       var mushroom = cc.SpriteBatchNode.create(s_StickyMushroom_Png, 1);
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

var RoarMushroom = ItemSprite.extend({
    name:"roar",
    duration:30,
    angerValue:50,

    ctor:function(pos){
        this._super(pos);

        var mushroom = cc.SpriteBatchNode.create(s_RoarMushroom_Png, 1);
        this.initWithTexture(mushroom, cc.rect(0, 0, 50, 53), false);
    },

    trigger:function(){
        GameController.gameScene.addEnemies(WolfLeader, GameController.gameScene.sisi.level+2, this.getPosition(), 30);
    }
 });

var ShiftMushroom = ItemSprite.extend({
    name: "shift",
    duration: 30,
    angerValue: 30,

    shiftType:null,

    ctor:function(pos, type){
        this._super(pos);

        if(this.shiftType == "acute"){
            var mushroom = cc.SpriteBatchNode.create(s_AcuteMushroom_Png, 1);
            this.initWithTexture(mushroom, cc.rect(0, 0, 41, 66), false);
        }else if(this.shiftType == "slow"){
            var mushroom = cc.SpriteBatchNode.create(s_SlowMushroom_Png, 1);
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
    }
});

var VisibleMushroom = ItemSprite.extend({
    name: "visible",
    duration: 0,
    angerValue: 60,

    ctor:function(pos){
        this._super(pos);

        var mushroom = cc.SpriteBatchNode.create(s_VisibleMushroom_Png, 1);
        this.initWithTexture(mushroom, cc.rect(0, 0, 52, 60), false);
    },

    trigger:function(){

    }
});


