/**
 * Created by panda on 12/20/13.
 */

var LevelLayer = ({

    level:0,
    init: function(level) {
       // this._super(level);

        return true;
    }
});
LevelLayer.create = function (level) {
    var layer = new LevelLayer();
    if (layer && layer.init(level)) {
        return layer;
    }
    return null;
};

