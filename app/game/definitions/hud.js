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
                                "BEING",
                                App.Game.settings.hud.mainFont, 
                                '#000', 
                                50, 
                                200
                        );

                        App.Draw.get('hud').writeText(
                                "press SPACE to begin",
                                App.Game.settings.hud.smallFont, 
                                '#000', 
                                50, 
                                230
                        );
                }, 

                gameOver: function() {
                        App.Draw.get('hud').writeText(
                                "GAME OVER - SPACE to play again",
                                App.Game.settings.hud.smallFont, 
                                '#000', 
                                100, 
                                430
                        );
                }, 

                quitScreen: function() {

                        App.Draw.get('hud').writeText(
                                "Really quit?",
                                App.Game.settings.hud.midFont, 
                                '#000', 
                                50, 
                                230
                        );

                        App.Draw.get('hud').writeTextMultiLine(
                                "(Y)es|(N)o",
                                App.Game.settings.hud.smallFont, 
                                '#000', 
                                60, 
                                260, 
                                24
                        );
                }
        };

        root.App.Defaults.Huds = huds;

})(this);