(function(root) {

        var huds = {

                loading: function() {

                        App.Draw.get('hud').writeText(
                                "LOADING",
                                App.Game.settings.hud.medFont, 
                                '#000', 
                                50, 
                                250
                        );
                }, 

                titleScreen: function() {

                        App.Draw.get('hud').writeText(
                                "TITLE",
                                App.Game.settings.hud.mainFont, 
                                '#000', 
                                50, 
                                250
                        );

                        App.Draw.get('hud').writeText(
                                "PRESS SPACE TO BEGIN",
                                App.Game.settings.hud.smallFont, 
                                '#000', 
                                50, 
                                280
                        );
                }
        };

        root.App.Defaults.Huds = huds;

})(this);