/**
 * Created by panda on 12/20/13.
 */

var Level = cc.Class.extend
({
    actors: {},

    ctor: function(data)
    {
        var actorsdata = data.actors;

        for(var leaderIndex in actorsdata)
        {
            var actordata = actorsdata[leaderIndex]

            this.actors[leaderIndex] = new actordata.className();
        }
    }
});
var level1_data =
{
    actors:
    {
        lori :
        {
            className: Sisi,
            initPosition : 0
        },
        leader1 :
        {
            className: "Leader1",
            level : 0,
            initPosition : 0,
            memenberNum:0,
            attack:0,
            hp:0,
            speed:0
        }
    }
};
