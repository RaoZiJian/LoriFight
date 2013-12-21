var BaseScene = cc.Scene.extend({
    controller: null,
    res: [],

    ctor: function() {
        this._super();
    }
});

var GameController = (function() {

    return {
        app: null,
        director: null,
        menuScene: null,
        levelScene: null,
        gameScene: null,
        configScene: null,

        current: null,

        init: function(app) {
            this.app = app;
            this.menuScene = new MenuScene();
            this.levelScene = new LevelScene();
            this.gameScene = new GameScene();
            this.director = cc.Director.getInstance();
        },

        transitionToScene: function(scene) {
            //load resources
            var director = this.director;
            cc.LoaderScene.preload(scene.res, function () {
                director.replaceScene(scene);
            }, this.app);
        }
    }
})();