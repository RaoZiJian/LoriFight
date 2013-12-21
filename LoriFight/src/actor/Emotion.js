/**
 * Created by panda on 12/20/13.
 */

var Emotion = cc.Sprite.extend({
    ctor: function(emotionfile, rect) {
        this._super();
        this.initWithFile(emotionfile, rect);
    }
});