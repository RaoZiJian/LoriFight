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

    init:function(){

        this.addWidget(cc.UIHelper.getInstance().createWidget(s_GameMenuUI_1));
    }
});