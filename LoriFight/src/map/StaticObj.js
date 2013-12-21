/**
 * Created by panda on 12/21/13.
 */

var StaticObj = cc.Sprite.extend({
    body: null,

    ctor: function(filename, rect, pos) {
        this._super();
        this.init(filename, rect);

        this.setPosition(pos);

        this.body = new PhysicsObject(this.weight, this.radius, this.moveSpeed, pos);
    }
});