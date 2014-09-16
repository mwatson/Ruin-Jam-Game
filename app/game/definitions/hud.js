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

                copyright: function() {
                        App.Draw.get('hud').writeTextMultiLine(
                                "      A Game By Mike Watson|(c) 2014, mantiseyelabs.com",
                                App.Game.settings.hud.tinyFont, 
                                '#000', 
                                340, 
                                420, 
                                20
                        );

                        App.Draw.get('hud').writeText(
                                "v" + App.Game.version,
                                App.Game.settings.hud.tinyFont, 
                                '#000', 
                                50, 
                                440
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