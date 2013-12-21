/**
 * Created by panda on 12/20/13.
 */

var GameUILayer = ccs.UILayer.extend({

    settingBtn:null,
    bloodBar:null,
    score:null,
    widget:null,
    angerExpression:null,
    angerFire:null,
    winSize:null,

    init:function(){

        if(this._super()){
            this.winSize = cc.Director.getInstance().getWinSize();
            //        this.addWidget(ccs.GUIReader.getInstance().widgetFromJsonFile(s_GameMenuUI_1));
            this.widget = ccs.GUIReader.getInstance().widgetFromJsonFile(s_GameMenuUI_1);
            this.addWidget(this.widget, 2);

            //this.settingBtn    = this.getWidgetByName("settingBtn");
            this.bloodBar      = this.getWidgetByName("blood");
            this.distanceScore = this.getWidgetByName("Score");
            this.angerExpression = this.setAngerExpression(50);

            //this.settingBtn.addTouchEventListener(this.settingBtnCallback, this);
            this.setBloodBarPercent(100);
            this.setScore(0);
        }
    },

    setAngerExpression: function(angerValue){

        if(this.angerFire!=null){
            for(var i=0;i<this.angerFire.length;i++){

                this.angerFire[i].removeFromParent(true);
                this.angerFire[i] = null;
            }
        }

        if(angerValue>=100){
            this.angerExpression = cc.Sprite.create(s_Anger2_Png);
            this.angerFire = new Array(3);
        }else if(300>angerValue>=200){
            this.angerExpression = cc.Sprite.create(s_Anger3_Png);
            this.angerFire = new Array(4);
        }else if(angerValue>=300){
            this.angerExpression = cc.Sprite.create(s_Anger4_Png);
            this.angerFire = new Array(5);
        }else if(angerValue<=50){
            this.angerExpression = cc.Sprite.create(s_Anger5_Png);
            this.angerFire = new Array(1);
        }else if(50<angerValue<100){
            this.angerExpression = cc.Sprite.create(s_Anger1_Png);
            this.angerFire = new Array(2);
        }

        this.angerExpression.setScale(0.6);
        this.angerExpression.setOpacity(200);
        this.angerExpression.setAnchorPoint(cc.p(0,0));
        this.angerExpression.setPosition(cc.p(this.winSize.width/4, this.winSize.height/6));
        this.addChild(this.angerExpression);
        this.setAngerFire();
    },

    setAngerFire:function(){
        for(var i=0; i<this.angerFire.length;i++){

            var angerFireSprite = cc.Sprite.create(s_AngerFire_Png);
            angerFireSprite.setAnchorPoint(cc.p(0,0));
            angerFireSprite.setPosition(cc.p(this.winSize.width/4 + 55*(i+1), this.winSize.height/6-5));
            this.addChild(angerFireSprite);
            this.angerFire[i] = angerFireSprite;
        }
    },

    onTouchBegan: function(touch, event) {
        this._super(touch, event);
        GameController.gameScene.camera.onTouchBegan(touch, event);
    },

    onTouchMoved: function(touch, event) {
        this._super(touch, event);
        //GameController.gameScene.camera.onTouchMoved(touch, event);
    },

    onTouchEnded: function(touch, event) {
        this._super(touch, event);
        //GameController.gameScene.camera.onTouchEnded(touch, event);
    },

    setBloodBarPercent:function(value){
        this.bloodBar.setPercent(value)
    },

    setScore:function(value){

        this.distanceScore.setStringValue(value);
    },

    setShinningLevel:function(level){

        var shinningSprite = cc.Sprite.create(s_Shinning_Png);
        shinningSprite.setOpacity(200);
        shinningSprite.setAnchorPoint(0,0);
        shinningSprite.setPosition(cc.p(0,0));
        this.addChild(shinningSprite,1);
    }
});