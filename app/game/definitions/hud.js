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
                                50, 
                                250
                        );

                        App.Draw.get('hud').writeText(
                                "PRESS SPACE TO BEGIN",
                                App.Game.settings.hud.smallFont, 
                                '#FFF', 
                                50, 
                                280
                        );
                }
        };

        root.App.Defaults.Huds = huds;

})(this);