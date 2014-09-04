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

                                        if(App.Controls.keyPress('SPACE')) {
                                                App.Game.setGameState('setup', function(){
                                                });
                                        }
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

                                        App.Player.init();

                                        if(1) {
                                                App.Game.setGameState('gameplay', function(){
                                                });
                                        }
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

                                        App.Player.playerEnt.c('Renderable').draw(interpolation, 'entity', moveDelta);
                                },

                                update: function() {

                                        App.Player.playerEnt.c('Player').behavior();
                                }
                        }
                }
        };

        root.App.Defaults.GameStates = gameStates;

})(this);
