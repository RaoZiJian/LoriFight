/**
 * Created by panda on 12/20/13.
 */

var Level1 =
({
    lori :
    {
        initPosition : 0
    },
    monster1 :
    {
        monsterId : "",
        level : 0,
        initPosition : 0
    },
    monster2 :
    {
        monsterId : "",
        level : 0,
        initPosition : 0
    }
});
Level1.create = function ()
{
    var Level1 = new Level1();
    if (Level1)
    {
        return Level1;
    }
    return null;
};

