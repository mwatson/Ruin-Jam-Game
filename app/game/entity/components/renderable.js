(function(root){

        var renderable = function(entity, settings) {

                var en = entity, 
                    // store the state for sprites
                    curState = '', 
                    prevState = '', 
                    curFrame = 0, 
                    frameCtr = 0, 
                    bobCtr = 0,
                    bobInfo = { 
                        bobs: false,
                        x: { min: 0, max: 0, cur: 0, dir: 0 }, 
                        y: { min: 0, max: 0, cur: 0, dir: 0 }, 
                        step: 0, 
                        stepTime: 0
                    }, 
                    flash = {
                        total: 0, 
                        frame: 0
                    },
                    shakeTime = 0, 
                    shakeDir = { x: 0, y: 0 };

                this.attrs = {
                        color: settings.color,
                        sprites: {
                                idle: [],
                                walk: []
                        }, 
                        shadow: _.isUndefined(settings.shadow) ? false : settings.shadow
                };

                this.initShake = function(duration, x, y) {
                        shakeTime = duration;
                        shakeDir.x = x;
                        shakeDir.y = y;
                };

                this.shake = function() {

                        shakeTime -= App.Game.gameTicks() - App.Game.lastUpdate;

                        shakeDir.x *= -1;
                        shakeDir.y *= -1;

                        if(shakeTime <= 0) {
                                shakeTime = 0;
                        }
                };

                this.initBob = function(xMin, xMax, yMin, yMax, step, stepTime) {
                        bobInfo.x.min = xMin;
                        bobInfo.x.max = xMax;
                        bobInfo.x.cur = xMin;

                        bobInfo.y.min = yMin;
                        bobInfo.y.max = yMax;
                        bobInfo.y.cur = yMin;

                        bobInfo.step = step;
                        bobInfo.stepTime = stepTime;

                        bobInfo.bobs = true;
                };

                this.bob = function() {
                        bobCtr += App.Game.gameTicks() - App.Game.lastUpdate;
                        if(bobCtr > bobInfo.stepTime) {
                                bobCtr = 0;
                                // eventually do this for x dir
                                if(bobInfo.y.cur >= bobInfo.y.max) {
                                        bobInfo.y.dir = -1;
                                } else if(bobInfo.y.cur <= bobInfo.y.min) {
                                        bobInfo.y.dir = 1;
                                }

                                bobInfo.y.cur += bobInfo.step * bobInfo.y.dir;
                        }
                };

                if(!_.isUndefined(settings.hasBob)) {
                        this.initBob(
                                settings.hasBob[0],
                                settings.hasBob[1],
                                settings.hasBob[2],
                                settings.hasBob[3],
                                settings.hasBob[4],
                                settings.hasBob[5]
                        );
                }

                this.draw = function(interpolation, canvasId, moveDelta) {

                        if(!moveDelta) {
                                moveDelta = 1;
                        }

                        if(!canvasId) {
                                canvasId = 'entity';
                        }

                        var lastPos = en.c('Movable').getLastPos(), 
                            xDir = en.attrs.x - lastPos.x, 
                            xPos = en.attrs.x + en.attrs.velocity.x * interpolation * moveDelta, 
                            yPos = en.attrs.y + en.attrs.velocity.y * interpolation * moveDelta, 
                            diff = App.Game.gameTicks() - App.Game.lastUpdate, 
                            statusCol = '';

                        if(shakeTime) {
                                this.shake();
                                xPos += shakeDir.x;
                                yPos += shakeDir.y;
                        }

                        if(bobInfo.bobs) {
                                this.bob();
                                yPos += bobInfo.y.cur;
                        }

                        if(this.attrs.sprites) {

                                curState = en.state;
                                if(_.isUndefined(this.attrs.sprites[curState])) {
                                        curState = 'idle';
                                }

                                if(curState != prevState) {
                                        // reset frame counter
                                        curFrame = 0;
                                        frameCtr = 0;
                                        prevState = curState;
                                }

                                if(_.isUndefined(this.attrs.sprites[curState][curFrame])) {
                                        curFrame = 0;
                                        frameCtr = 0;
                                }

                                frameCtr += diff;
                                if(frameCtr > this.attrs.sprites[curState][curFrame].duration) {
                                        curFrame++;
                                        frameCtr = 0;
                                }

                                if(_.isUndefined(this.attrs.sprites[curState][curFrame])) {
                                        curFrame = 0;
                                }

                                App.Draw.get(canvasId).drawImgData(
                                        this.attrs.sprites[curState][curFrame].frame,
                                        xPos,
                                        yPos, 
                                        16, 
                                        16, 
                                        en.attrs.width,
                                        en.attrs.height, 
                                        xDir < 0 ? 16 : 0, 
                                        0
                                );

                        } else {

                                App.Draw.get(canvasId).fillRect(
                                        xPos, 
                                        yPos, 
                                        en.attrs.width, 
                                        en.attrs.height, 
                                        this.attrs.color
                                );
                        }

                        // draw their shadow
                        if(this.attrs.shadow) {
                                // shadows don't bob
                                if(bobInfo.bobs) {
                                        yPos -= bobInfo.y.cur;
                                }

                                App.Draw.get(canvasId).ctx.globalCompositeOperation = "destination-over";
                                App.Draw.get(canvasId).drawImg(
                                        this.attrs.shadow, 
                                        xPos, 
                                        yPos + en.attrs.height - Math.floor(en.attrs.height / 8)
                                );
                        }

                        App.Draw.get(canvasId).ctx.globalCompositeOperation = "source-over";

                        if(!_.isUndefined(settings.draw)) {
                                settings.draw(xPos, yPos);
                        }
                };
        };

        root.App.Objects.Components.Renderable = renderable;
        
})(this);
