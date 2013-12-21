/**
 * Created by panda on 12/20/13.
 */

var Level = cc.Class.extend({
    actors: {},

    ctor: function(data) {
        var actorsdata = data.actors;

        for(var i in actorsdata) {
            var actordata = actorsdata[i]
            this.actors[i] = new actordata.className();
        }
    }
});