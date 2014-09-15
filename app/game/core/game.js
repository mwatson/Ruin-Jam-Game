(function(root){
        var game = function() {

                this.version = "0.5.1";
                this.versionString = "Being v" + this.version;
                
                var self = this;

                this.guid = false;

                // for node-webkit
                this.win = null;

                this.platform = 'web';

                var gameRunning = false, 
                    loopDelay = 0;

                this.settings = {};

                this.seed = null;

                this.init = function(settings) {
        
                        this.settings = settings.game;

                        if(typeof require != 'undefined') {
                                var gui = require('nw.gui');
                                this.win = gui.Window.get();
                                if(process.platform == "darwin") {
                                        var nativeMenuBar = new gui.Menu({ type: "menubar" });
                                        nativeMenuBar.createMacBuiltin("Being", {
                                                hideEdit: true,
                                                hideWindow: true
                                        });
                                        this.win.menu = nativeMenuBar;
                                        this.platform = 'osx';
                                } else {
                                        this.platform = 'win';
                                }
                        }
                        
                        // initialize game objects
                        App.Tools       = new App.Objects.Tools();
                        App.Definitions = new App.Objects.Definitions();
                        App.Storage     = new App.Objects.Storage();
                        App.Draw        = new App.Objects.Draw(settings.draw);
                        //App.Sound       = new App.Objects.Sound(settings.sound);
                        App.Controls    = new App.Objects.Controls();

                        // init savefiles
                        App.Saves = {};
                        App.Saves.GuidSave = new App.Objects.SaveFile(App.Defs.Saves_GuidSave);
                        App.Saves.PlayerSave = new App.Objects.SaveFile(App.Defs.Saves_PlayerSave);

                        // Load assets
                        App.Tools.assetLoader();

                        // init player
                        App.Player = new App.Objects.Player(settings.player);

                        gameRunning = true;

                        this.skipTicks = ~~(1000 / this.settings.updatecap);

                        // start the game
                        this.gameLoop();
                };

                this.setFPSCap = function(cap) {
                        this.settings.fpscap = cap;
                        loopDelay = ~~(1000 / this.settings.fpscap);
                };

                this.prevState = '';
                this.gameState = 'loading';
                this.newState = null;
                
                // use this to change the gamestate. it will 
                // actually not do so, but the state will be updated on the next tick
                this.setGameState = function(newState, callback) {
                        if(newState != this.gameState && !this.newState) {
                                this.newState = { state: newState };
                                if(!_.isUndefined(callback)) {
                                        this.newState.callback = callback;
                                }
                        }
                };

                // updates the game state with data stored in this.newState
                var updateGameState = function() {
                        if(!App.Game.newState) {
                                return false;
                        }

                        App.Game.prevState = App.Game.gameState;
                        App.Game.gameState = App.Game.newState.state;

                        // run transition away
                        if(!_.isUndefined(App.Defs.GameStates[App.Game.prevState].transition)) {
                                App.Defs.GameStates[App.Game.prevState].transition.away();
                        }

                        // run transition to new state
                        if(!_.isUndefined(App.Defs.GameStates[App.Game.gameState].transition)) {
                                App.Defs.GameStates[App.Game.gameState].transition.to();
                        }

                        if(!_.isUndefined(App.Game.newState.callback)) {
                                App.Game.newState.callback();
                        }

                        App.Game.newState = null;
                        return true;
                };

                this.gameTicks = function() {
                        //return (new Date()).getTime();
                        return Date.now();
                        //return performance.now();
                };

                this.waitTimers = {};

                var loops = 0,
                    skipTicks = 1000 / 30, 
                    maxFrameskip = 10, 
                    nextGameTick = this.gameTicks(), 
                    lastGameTick;

                this.gameLoop = function() {

                        while(self.gameTicks() > nextGameTick) {
                                self.updateOps();
                                nextGameTick += skipTicks;
                                loops++;
                        }

                        if(App.Defs.Assets.Loaded.Complete) {
                                if(!loops) {
                                        self.drawOps((nextGameTick - self.gameTicks()) / skipTicks);
                                } else {
                                        self.drawOps(0);
                                }
                        }

                        // keep the loopInfo manageable 
                        _.each(self.loopInfo, function(val, key) {
                                if(self.loopInfo[key].length > 250) {
                                        self.loopInfo[key].splice(0, self.loopInfo[key].length - 250);
                                }
                        });

                        requestAnimationFrame(self.gameLoop);
                };
                
                this.loopInfo = {
                        draw: [], 
                        update: []
                };

                this.gameSpeed = 50;

                this.bgColor = '#EEE';

                this.lastDraw = null;
                var plax = -1, plAccum = 0;
                this.drawOps = function(interpolation) {

                        var curTime = this.gameTicks(), 
                            //interpolation = (curTime - this.lastUpdate) / this.gameSpeed, 
                            moveDelta = (curTime - this.lastUpdate) / 20;

                        App.Draw.get('hud').clear();
                        App.Draw.get('entity').clear();
                        
                        App.Draw.get('background').clear();

                        //App.Draw.drawTransitions(interpolation);

                        App.Defs.GameStates.all.tick.draw(interpolation, moveDelta);

                        App.Defs.GameStates[this.gameState].tick.draw(interpolation, moveDelta);

                        if(App.Game.settings.debug.fps) {
                                App.Tools.printFPS('hud', App.Game.loopInfo);
                                //App.Tools.printEntityPos('hud', App.World.getPlayer());
                        }

                        //App.Draw.render();

                        //
                        // this should be at the end of the loop
                        //
                        var drawTime = this.gameTicks();
                        if(this.lastDraw !== null) {
                                var d = drawTime - this.lastDraw;
                                this.loopInfo.draw.push(d);
                        }

                        this.lastDraw = drawTime;
                };

                this.centerCamera = function(interpolation, moveDelta) {
                        var camera = App.World.map.camera, 
                            cameraCenter = camera.center(), 
                            originX = -((cameraCenter.x + camera.attrs.velocity.x * interpolation * moveDelta) - (App.Draw.width() / 2)), 
                            originY = -((cameraCenter.y + camera.attrs.velocity.y * interpolation * moveDelta) - (App.Draw.height() / 2));

                        App.Draw.setOrigin(~~originX, ~~originY);
                };
                
                this.moveDelta = 1;
                this.lastUpdate = this.gameTicks();
                var lastSize = { width: 0, height: 0 };
                this.updateOps = function() {

                        var curTime = this.gameTicks(), 
                            updateDelta = (curTime - this.lastUpdate), 
                            callTime;

                        this.moveDelta = updateDelta / 20;

                        // this prevents the game from becoming janky when the UPS is slowed
                        // (which is what Chrome does if a tab is not active)
                        // I settled on 5 here because the moveDelta should be around 2.5 
                        // (20ups = 50ms per tick), 50 / 20 = 2.5 and 5 is double that
                        if(this.moveDelta > 5) {
                                this.moveDelta = 5;
                        }

                        updateGameState();

                        if(window.innerWidth != lastSize.width || 
                           window.innerHeight != lastSize.height) {
                                App.Draw.setResolution();
                                lastSize.width = window.innerWidth;
                                lastSize.height = window.innerHeight;
                        }

                        App.Defs.GameStates.all.tick.update();

                        App.Defs.GameStates[this.gameState].tick.update();

                        App.Draw.runTransitions();

                        //
                        // keep this stuff at the end of the loop
                        //
                        App.Controls.keysReset();

                        curTime = this.gameTicks();
                        callTime = Math.max(0, this.gameSpeed - (curTime - this.lastUpdate));

                        if(this.lastUpdate !== null) {
                                this.loopInfo.update.push(curTime - this.lastUpdate);
                        }

                        this.lastUpdate = curTime;
                };

                this.gameplayOps = function() {
                        this.entityOps(true);
                        this.playerOps();
                };

                this.entityOps = function(excludePlayer) {
                        // run all entity timers and behaviors
                        for(var i = 0; i < App.World.map.entities.length; i++) {

                                if(excludePlayer && App.World.map.entities[i].is('IsPlayer')) {
                                        continue;
                                }

                                if(App.World.map.entities[i].removed) {
                                        continue;
                                }

                                if(App.World.map.entities[i].is('IsEnemy')) {
                                        App.World.map.entities[i].c('IsEnemy').behavior();
                                }

                                if(App.World.map.entities[i].is('Projectile')) {
                                        App.World.map.entities[i].c('Projectile').behavior();
                                }

                                if(App.World.map.entities[i].is('IsCamera')) {
                                        App.World.map.entities[i].c('IsCamera').behavior();
                                }

                                if(App.World.map.entities[i].is('Particle')) {
                                        App.World.map.entities[i].c('Particle').behavior();
                                }

                                if(App.World.map.entities[i].is('Emitter')) {
                                        App.World.map.entities[i].c('Emitter').behavior();
                                }
                        }
                };

                this.entityEvents = function() {
                        // run all entity turn-based events
                        for(var i = 0; i < App.World.map.entities.length; i++) {
                                App.World.map.entities[i].runEvents();
                        }
                };

                this.turn = 0;
                this.level = 0;
                this.score = 0;

                this.best = {
                        score: -1,
                        level: 0
                };

                this.genMap = true;

                this.playerOps = function() {
                        var player = App.Player.playerEnt;
                        if(player.is('Movable')) {
                                if(player.c('Movable').hasTarget()) {
                                        player.c('Movable').moveToTile();
                                }
                        }

                        if(player.is('Emitter')) {
                                player.c('Emitter').behavior();
                        }
                };
        };
        
        root.App.Objects.Game = game;
        
})(this);
