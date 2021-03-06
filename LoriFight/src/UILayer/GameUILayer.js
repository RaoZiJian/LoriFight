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
    shinningSprite:null,
    mushroomBuffArray:null,

    init:function(){

        if(this._super()){
            this.winSize = cc.Director.getInstance().getWinSize();
            //        this.addWidget(ccs.GUIReader.getInstance().widgetFromJsonFile(s_GameMenuUI_1));
            this.widget = ccs.GUIReader.getInstance().widgetFromJsonFile(s_GameMenuUI_1);
            this.addWidget(this.widget);

            //this.settingBtn    = this.getWidgetByName("settingBtn");
            this.bloodBar      = this.getWidgetByName("blood");
            this.distanceScore = this.getWidgetByName("Score");
            this.setAngerExpression(50);

            //this.settingBtn.addTouchEventListener(this.settingBtnCallback, this);
            this.setBloodBarPercent(100);
            this.setScore(0);

            this.shinningSprite = cc.Sprite.create(s_Shinning_Png,cc.rect(0,0,960,640));
            this.shinningSprite.setVisible(false);
            this.shinningSprite.setAnchorPoint(cc.p(0,0));
            this.shinningSprite.setPosition(cc.p(0,0));
            this.addChild(this.shinningSprite,-1);

            this.mushroomBuffArray = new Array();
        }
    },

    setAngerExpression: function(angerValue){

        if(this.angerExpression != null){

            this.angerExpression.removeFromParent();
            this.angerExpression == null;
        }

        if(this.angerFire!=null){
            for(var i=0;i<this.angerFire.length;i++){

                this.angerFire[i].removeFromParent(true);
                this.angerFire[i] = null;
            }
        }

        if(angerValue<=50){
            this.angerExpression = cc.Sprite.create(s_Anger5_Png);
            this.angerFire = new Array(1);
        } else if(angerValue>50 && angerValue <=120){
            this.angerExpression = cc.Sprite.create(s_Anger1_Png);
            this.angerFire = new Array(2);
        }else if(angerValue>120 && angerValue<=200){
            this.angerExpression = cc.Sprite.create(s_Anger2_Png);
            this.angerFire = new Array(3);
        }else if(angerValue>200 && angerValue<=280){
            this.angerExpression = cc.Sprite.create(s_Anger3_Png);
            this.angerFire = new Array(4);
        }else if(angerValue>280){
            this.angerExpression = cc.Sprite.create(s_Anger4_Png);
            this.angerFire = new Array(5);
        }

        this.angerExpression.setScale(0.6);
        this.angerExpression.setOpacity(200);
        this.angerExpression.setAnchorPoint(cc.p(0,0));
        this.angerExpression.setPosition(cc.p(this.winSize.width/4, this.winSize.height/12));
        this.addChild(this.angerExpression);
        this.setAngerFire();
    },

    setAngerFire:function(){
        for(var i=0; i<this.angerFire.length;i++){

            var angerFireSprite = cc.Sprite.create(s_AngerFire_Png);
            angerFireSprite.setAnchorPoint(cc.p(0,0));
            angerFireSprite.setPosition(cc.p(this.winSize.width/4 + 55*(i+1), this.winSize.height/12-5));
            this.addChild(angerFireSprite);
            this.angerFire[i] = angerFireSprite;
        }
    },

    onTouchBegan: function(touch, event) {
        this._super(touch, event);
        //GameController.gameScene.camera.onTouchBegan(touch, event);
        return false;
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
        this.shinningSprite.setVisible(true);
        this.shinningSprite.setOpacity(level);
    },

    addMushroomBuffStatus:function(mushroomBuff){

        if(this.mushroomBuffArray.length<6){
            this.mushroomBuffArray.push(mushroomBuff);

            mushroomBuff.setAnchorPoint(cc.p(0,0))
            mushroomBuff.setPosition(cc.p(this.bloodBar.getPosition().x + this.mushroomBuffArray.length * 60 + 80,this.bloodBar.getPosition().y -20));

            cc.log(mushroomBuff.getPosition());

            this.addChild(mushroomBuff);
         }
    }
});