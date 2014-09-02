(function(root){

        var camera = function(entity, settings) {

                this.en = entity;

                var target = 0, 
                    shakeTime = 0, 
                    shakeDir = { x: 0, y: 0 };

                this.behavior = function() {
                        if(shakeTime) {
                                this.shake();
                        }
                        this.follow();
                };

                this.setTarget = function(newTarget) {
                        target = newTarget;
                };

                this.follow = function() {
                        var player = App.World.map.entities[target], 
                            pCenter = player.center(), 
                            cCenter = this.en.center(), 
                            xDir = 0,  
                            yDir = 0, 
                            newPos;

                        if(cCenter.x > pCenter.x && cCenter.x - pCenter.x > this.en.attrs.width / 2) {
                                xDir = -1;
                        } else if(cCenter.x < pCenter.x && pCenter.x - cCenter.x > this.en.attrs.width / 2) {
                                xDir = 1;
                        }

                        if(cCenter.y > pCenter.y && cCenter.y - pCenter.y > this.en.attrs.height / 2) {
                                yDir = -1;
                        } else if(cCenter.y < pCenter.y && pCenter.y - cCenter.y > this.en.attrs.height / 2) {
                                yDir = 1;
                        }

                        this.en.c('Movable').move(xDir, yDir);
                };

                this.initShake = function(duration, x, y) {
                        shakeTime = duration;
                        if(Math.abs(x) > Math.abs(shakeDir.x)) {
                                shakeDir.x = x;
                        }
                        if(Math.abs(y) > Math.abs(shakeDir.y)) {
                                shakeDir.y = y;
                        }
                };

                this.shake = function() {

                        shakeTime -= App.Game.gameTicks() - App.Game.lastUpdate;

                        shakeDir.x *= -1;
                        shakeDir.y *= -1;

                        this.en.c('Movable').move(shakeDir.x, shakeDir.y);

                        if(shakeTime <= 0) {
                                shakeTime = 0;
                                shakeDir.x = 0;
                                shakeDir.y = 0;
                        }
                };
        };

        root.App.Objects.Components.Camera = camera;

})(this);
