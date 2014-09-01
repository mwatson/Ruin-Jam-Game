(function(root) {

        var huds = {

                loading: function() {

                        App.Draw.get('hud').writeText(
                                "LOADING",
                                App.Game.settings.hud.mainFont, 
                                '#FFF', 
                                100, 
                                100
                        );
                }, 

                titleScreen: function() {

                        App.Draw.get('hud').writeText(
                                "A GAME",
                                App.Game.settings.hud.mainFont, 
                                '#FFF', 
                                100, 
                                100
                        );
                }
        };

        root.App.Defaults.Huds = huds;

})(this);