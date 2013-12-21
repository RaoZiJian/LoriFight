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
    _touchforme:true,

    init:function(){

        if(this._super()){

            //this.addWidget(ccs.GUIReader.getInstance().widgetFromJsonFile(s_GameMenuUI_1));
            this.widget = ccs.GUIReader.getInstance().widgetFromJsonFile(s_GameMenuUI_1);
            this.addWidget(this.widget);

            //this.settingBtn    = this.getWidgetByName("settingBtn");
            this.bloodBar      = this.getWidgetByName("blood");
            this.distanceScore = this.getWidgetByName("Score");

            //this.settingBtn.addTouchEventListener(this.settingBtnCallback, this);
            this.setBloodBarPercent(100);
            this.setScore(0);
        }
    },

    settingBtnCallback:function(){


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