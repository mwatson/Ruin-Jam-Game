(function(root) {

        var gameStates = {

                all: {

                        tick: {
                                draw: function() {
                                        /*
                                        App.Draw.get('background').clearRect(0, 0, 640, 480);
                                        App.Draw.get('background').fillRect(
                                                0, 0, 640, 480, App.Game.bgColor
                                        );
                                        */
                                }, 

                                update: function() {
                                        if(App.Game.settings.debug.nwAllowInspector && App.Controls.keyPress('TILDE') && App.Game.win) {
                                                if(App.Game.win.isDevToolsOpen()) {
                                                        App.Game.win.closeDevTools();
                                                } else {
                                                        App.Game.win.showDevTools();
                                                }
                                        }

                                        if(App.Game.gameState == "gameplay" || 
                                           App.Game.gameState == "gameover"
                                        ) {
                                                if(App.Controls.keyPress('ESC')) {
                                                        App.Game.setGameState('quit', function(){
                                                        });
                                                }
                                        }
                                }
                        }
                }, 

                loading: {

                        transition: {
                                to: function() {
                                        App.Draw.get('background').setBgColor('#EEE');
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
                                        App.Draw.get('background').setBgColor('#EEE');
                                }, 
                                away: function() {
                                }
                        }, 

                        tick: {
                                draw: function(interpolation, moveDelta) {
                                        App.Defs.Huds.titleScreen();
                                        App.Defs.Huds.copyright();
                                },

                                update: function() {

                                        if(App.Controls.keyPress('SPACE')) {
                                                App.Game.setGameState('setup', function(){
                                                        // generate guid
                                                        App.Game.guid = App.Tools.guid();

                                                        // load guid
                                                        App.Saves.GuidSave.load();

                                                        // seed the RNG with the GUID
                                                        Math.seedrandom(App.Game.guid);
                                                        App.Game.seed = Math.random;
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
                                                        App.Saves.GuidSave.save();
                                                        App.Saves.PlayerSave.save();
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
                                        App.Player.playerEnt.c('Player').runTimers();
                                }
                        }
                }, 

                gameover: {

                        transition: {
                                to: function() {
                                }, 
                                away: function() {
                                }
                        }, 

                        tick: {
                                draw: function(interpolation, moveDelta) {
                                        App.Defs.Huds.gameOver();

                                        App.Player.playerEnt.c('Renderable').draw(interpolation, 'entity', moveDelta);
                                },

                                update: function() {
                                        if(App.Controls.keyPress('SPACE')) {
                                                App.Game.setGameState('titlescreen', function(){
                                                });
                                        }
                                }
                        }
                }, 

                quit: {
                        transition: {
                                to: function() {
                                }, 
                                away: function() {
                                }
                        }, 

                        tick: {
                                draw: function(interpolation, moveDelta) {
                                        App.Defs.Huds.quitScreen();
                                        App.Defs.Huds.copyright();
                                },

                                update: function() {
                                        if(App.Controls.keyPress('Y')) {
                                                // quit the game
                                                if(App.Game.win) {
                                                        App.Game.win.close();
                                                }
                                        }
                                        if(App.Controls.keyPress('N')) {
                                                var newState = 'gameplay';
                                                if(App.Player.playerEnt.c('Player').props.stage == 'death') {
                                                        newState = 'gameover';
                                                }
                                                App.Game.setGameState(newState);
                                        }
                                }
                        }
                }
        };

        root.App.Defaults.GameStates = gameStates;

})(this);
