/**
 * Created by panda on 12/20/13.
 */

var LevelLayer =
({
    init: function(level)
    {
       // this._super(level);
        return true;
    }
});
LevelLayer.create = function (level)
{
    var levelData;
    if(level == 1)
    {
        return Level1.create;
    }
    else if(level == 2)
    {
        return Level2.create;
    }
};

