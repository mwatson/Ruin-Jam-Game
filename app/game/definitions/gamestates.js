(function(root) {

        var gameStates = {

                all: {

                        tick: {
                                draw: function() {
                                }, 

                                update: function() {
                                        if(App.Game.settings.debug.nwAllowInspector && App.Controls.keyPress('TILDE') && App.Game.win) {
                                                if(App.Game.win.isDevToolsOpen()) {
                                                        App.Game.win.closeDevTools();
                                                } else {
                                                        App.Game.win.showDevTools();
                                                }
                                        }

                                        if(App.Controls.keyPress('ESC')) {
                                                switch(App.Game.gameState) {
                                                }
                                        }
                                }
                        }
                }, 

                loading: {

                        transition: {
                                to: function() {
                                }, 
                                away: function() {
                                }
                        }, 

                        tick: {
                                draw: function() {
                                        App.Defs.Huds.loading();
                                },

                                update: function() {
                                        App.Tools.assetFontCheck();
                                        if(App.Defs.Assets.Loaded.Complete) {
                                                App.Game.setGameState('titlescreen');
                                        }
                                }
                        }
                }, 

                titlescreen: {

                        transition: {
                                to: function() {
                                }, 
                                away: function() {
                                }
                        }, 

                        tick: {
                                draw: function(interpolation, moveDelta) {
                                        App.Defs.Huds.titleScreen();
                                },

                                update: function() {
                                }
                        }
                }, 

                setup: {

                        transition: {
                                to: function() {
                                }, 
                                away: function() {
                                }
                        }, 

                        tick: {
                                draw: function(interpolation, moveDelta) {
                                },

                                update: function() {
                                }
                        }
                }, 

                gameplay: {

                        transition: {
                                to: function() {
                                }, 
                                away: function() {
                                }
                        }, 

                        tick: {
                                draw: function(interpolation, moveDelta) {
                                },

                                update: function() {
                                }
                        }
                }
        };

        root.App.Defaults.GameStates = gameStates;

})(this);
