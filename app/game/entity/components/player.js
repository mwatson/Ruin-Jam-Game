(function(root){

        var player = function(entity, settings) {

                this.en = entity;

                this.props = {
                        stage: 'baby', 
                        life: 0, 
                        gender: 0, // scale of 0 (cis) - 100 (trans)
                        genderID: '',
                        sexuality: 0, // scale of 0 (straight) - 100 (gay)
                        skin: '', 
                        hair: ''
                };

                var timers = {}, 
                    life = {};

                // addTimer takes a number of miliseconds in the future to be triggered, 
                // but stores it relative to the current time so we can simulate stuff 
                // that happens when the game is not being played (not opened)
                this.addTimer = function(timerName, inTime, cbFunc) {
                        if(_.isUndefined(timers[timerName])) {
                                timers[timerName] = {
                                        when: App.Game.gameTicks() + inTime, 
                                        callback: cbFunc
                                };
                        }
                };

                this.removeTimer = function(timerName) {
                        if(!_.isUndefined(timers[timerName])) {
                                delete timers[timerName];
                        }
                };

                this.runTimers = function() {
                        var removals = [];
                        _.each(timers, function(timer, i){
                                if(timers[i].when <= App.Game.gameTicks()) {
                                        timers[i].callback();
                                        removals.push(i);
                                }
                        });

                        for(var x = 0; x < removals.length; x++) {
                                this.removeTimer(removals[x]);
                        }
                };

                var target = { x: -1, y: -1 };

                this.behavior = function() {

                        var xDir, yDir, xDiff, yDiff;

                        if(target.x < 0 && target.y < 0) {
                                target.x = App.Tools.rand(75, 565);
                                target.y = App.Tools.rand(150, 350);
                        }

                        xDiff = Math.abs(target.x - this.en.attrs.x);
                        if(target.x < 0) {
                                xDir = 0;
                        } else if(target.x > this.en.attrs.x && xDiff > 16) {
                                xDir = 1;
                        } else if(target.x < this.en.attrs.x && xDiff > 16) {
                                xDir = -1;
                        } else {
                                xDir = 0;
                                target.x = -1;
                        }

                        yDiff = Math.abs(target.y - this.en.attrs.y);
                        if(target.y < 0) {
                                yDir = 0;
                        } else if(target.y > this.en.attrs.y && yDiff > 16) {
                                yDir = 1;
                        } else if(target.y < this.en.attrs.y && yDiff > 16) {
                                yDir = -1;
                        } else {
                                yDir = 0;
                                target.y = -1;
                        }

                        this.en.c('Movable').move(xDir, yDir);
                };

                this.init = function() {
                        life.start = App.Game.gameTicks();

                        this.props.life = App.Tools.rand(0, 105);
                        this.props.gender = App.Tools.rand(0, 100);
                        this.props.genderID = App.Tools.rand(0, 1) ? 'm' : 'f';
                        this.props.sexuality = App.Tools.rand(0, 100);

                        this.addTimer('toChild', /*87600*/6000, function(){
                                App.Player.playerEnt.c('Player').props.stage = 'child';
                        });
                        this.addTimer('toTeen', /*87600*/12000, function(){
                                App.Player.playerEnt.c('Player').props.stage = 'teen';
                        });
                        this.addTimer('toAdult', /*87600*/18000, function(){
                                App.Player.playerEnt.c('Player').props.stage = 'adult';
                        });
                };

                this.init();
        };

        root.App.Objects.Components.Player = player;

})(this);
