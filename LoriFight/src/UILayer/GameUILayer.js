/**
 * Created by panda on 12/20/13.
 */

var shinningLayer = cc.Layer.extend({
   shinningLevel:null,

   ctor:function(){
       this._super();
   },

   init:function(){

   }
});

var GameUILayer = ccs.UILayer.extend({

    settingBtn:null,
    bloodBar:null,
    score:null,
    widget:null,
    angerExpression:null,
    angerFireNumber:null,
    angerFire:null,

    init:function(){

        if(this._super()){
            var winSize = cc.Director.getInstance().getWinSize();
    //        this.addWidget(ccs.GUIReader.getInstance().widgetFromJsonFile(s_GameMenuUI_1));
            this.widget = ccs.GUIReader.getInstance().widgetFromJsonFile(s_GameMenuUI_1);
            this.addWidget(this.widget);

            //this.settingBtn    = this.getWidgetByName("settingBtn");
            this.bloodBar      = this.getWidgetByName("blood");
            this.distanceScore = this.getWidgetByName("Score");
            this.angerExpression = cc.Sprite.create(s_Anger1_Png);
            this.angerExpression.setAnchorPoint(cc.p(0,0));
            this.angerExpression.setPosition(cc.p(winSize.width/4, winSize.height/6));
            this.angerExpression.setScale(0.6);
            this.angerExpression.setOpacity(200);
            this.angerFireNumber = 2;
            this.addChild(this.angerExpression);

            //this.settingBtn.addTouchEventListener(this.settingBtnCallback, this);
            this.setBloodBarPercent(100);
            this.setScore(0);
        }
    },

    setAngerExpression: function(angerValue){

        if(angerValue>=100){
            this.angerExpression.setTexture(s_Anger2_Png);
            this.angerFireNumber = 3;
        }else if(300>angerValue>=200){
            this.angerExpression.setTexture(s_Anger3_Png);
            this.angerFireNumber = 4;
        }else if(angerValue>=300){
            this.angerExpression.setTexture(s_Anger4_Png);
            this.angerFireNumber = 5;
        }else if(angerValue<=50){
            this.angerExpression.setTexture(s_Anger5_Png);
            this.angerFireNumber = 1;
        }else if(50<angerValue<100){
            this.angerExpression.setTexture(s_Anger1_Png);
        }

        this.setAngerFire();
    },

    setAngerFire:function(){

        for(var i=0; i<this.angerFireNumber;i++){

            this
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
    }
});