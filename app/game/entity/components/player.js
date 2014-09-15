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

                // for now the timescale is (realtime to gametime): 
                // 1m  = 1d

                // common gametimes to real times
                // 85yrs = ~21d
                // 65yrs = ~16d
                // 10yrs = 2.5d
                // 20yrs = 5d
                // 1yr = 6hr

                var timers = {}, 
                    life = {
                        start: 0, 
                        timescale: 60 // how many seconds in a day
                    };

                // convert in-game time to real-time miliseconds
                this.convertTime = function(gameTime) {
                        var gt = gameTime.split(' '), 
                            gNum = parseInt(gt[0], 10), 
                            gUnit = gt[1], 
                            mul = 1;

                            switch(gUnit) {
                                
                                case 'day':
                                case 'days':
                                        mul = 1;
                                        break;

                                case 'week':
                                case 'weeks':
                                        mul *= 7;
                                        break;

                                case 'month':
                                case 'months':
                                        mul *= 30;
                                        break;

                                case 'year':
                                case 'years':
                                        mul *= 365;
                                        break;
                            }

                            return life.timescale * gNum * mul * 1000;
                };

                // addTimer takes an in-game timeframe (6 years, 10 days etc) and converts it to 
                // real time, building a timer relative to the current time so we can simulate stuff 
                // that happens when the game is not being played (it's not opened)
                this.addTimer = function(timerName, inTime, cbFunc) {
                        if(_.isUndefined(timers[timerName])) {
                                var t = this.convertTime(inTime);
                                timers[timerName] = {
                                        when: this.getStart() + t, 
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

                        var xDir, yDir, xDiff, yDiff, xMin, xMax;

                        if(target.x < 0 && target.y < 0) {

                                if(this.en.attrs.x > 320) {
                                        xMin = 75;
                                        xMax = 200;
                                } else {
                                        xMin = 350;
                                        xMax = 565;
                                }

                                target.x = App.Tools.rand(xMin, xMax);
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

                this.setStart = function(timestamp) {
                        life.start = timestamp;
                };

                this.getStart = function() {
                        return life.start;
                };

                this.init = function() {
                        this.setStart(App.Game.gameTicks());
                        
                        this.props.life = 0;

                        var lifespans = [
                                { chance: 2,  min: 45,  max: 50 }, 
                                { chance: 8,  min: 50,  max: 55 }, 
                                { chance: 20, min: 55,  max: 65 }, 
                                { chance: 20, min: 65,  max: 75 }, 
                                { chance: 20, min: 75,  max: 85 }, 
                                { chance: 20, min: 85,  max: 95 }, 
                                { chance: 8,  min: 95,  max: 100 }, 
                                { chance: 2,  min: 100, max: 105 }
                        ], l = App.Tools.rand(1, 100), c = 0, i;

                        for(i = 0; i < lifespans.length; i++) {
                                c += lifespans[i].chance;
                                if(c >= l) {
                                        this.props.life = App.Tools.rand(lifespans[i].min, lifespans[i].max);
                                        break;
                                }
                        }

                        var diseases = [
                                { chance: 10, min: 0, max: 0 }, 
                                { chance: 50, min: 1, max: 3 }, 
                                { chance: 20, min: 5, max: 8 }, 
                                { chance: 10, min: 8, max: 12 }, 
                                { chance: 5, min: 12, max: 15 }, 
                                { chance: 3, min: 15, max: 20 }, 
                                { chance: 2, min: 20, max: 25 }
                        ], d = App.Tools.rand(1, 100);

                        c = 0;
                        for(i = 0; i < diseases.length; i++) {
                                c += diseases[i].chance;
                                if(c >= d) {
                                        this.props.life -= App.Tools.rand(diseases[i].min, diseases[i].max);
                                        break;
                                }
                        }

                        this.props.gender = App.Tools.rand(0, 100);
                        this.props.genderID = App.Tools.rand(0, 1) ? 'm' : 'f';
                        this.props.sexuality = App.Tools.rand(0, 100);
                };

                this.init();
        };

        root.App.Objects.Components.Player = player;

})(this);
