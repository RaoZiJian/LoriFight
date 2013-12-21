/**
 * Created by panda on 12/20/13.
 */

var itemSprite = cc.Sprite.extend({

    name:null,
    texture:null,
    duration:null,

    ctor:function(){
        this.__super();
    },

    /**
     * Trigger the buffer.
     */
   trigger:function(){

   }

});

var goldenMushroom = itemSprite.extend({

    attackTimes:null,

    ctor:function(){
        this._super();
        this.initWithFile(s_ShineMushroom_Png);
        this._super();
        this.name = "golden";
        this.duration = 9999999999;
    },

    trigger:function(){

      this.shine();
    },

    shine:function(){

        this.attackTimes++;

    }
});

var stickyMushroom = itemSprite.extend({

   ctor:function(){
       this._super();
       this.name = "sticky";
       this.duration = 30;
       this.initWithFile(s_StickyMushroom_Png);
   },

   trigger:function(){

       this.slowDown();
   },

   slowDown:function(){

   }
});

var roarMushroom = itemSprite.extend({

    ctor:function(){
        this._super();
        this.name = "roar";
        this.duration = 30;
        this.initWithFile(s_RoarMushroom_Png);
    },

    trigger:function(){

        this.roarWerewolf();
    },

    roarWerewolf:function(){


    }
});

var shiftMushroom = itemSprite.extend({

    shiftType:null,

    ctor:function(){

        this.__super();
        this.name = "shift";
        this.duration = 30;
        this.shiftType = type;
        if(this.shiftType == "acute"){
            this.initWithFile(s_AcuteMushroom_Png);
        }else if(this.shiftType == "slow"){
            this.initWithFile(s_SlowMushroom_Png)
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

var visibleMushroom = itemSprite.extend({

    ctor:function(){
        this._super();
        this.name = "golden";
        this.duration = 9999999999;
        this.initWithFile(s_VisibleMushroom_Png);
    },

    trigger:function(){

    }
})


