(function(root){

        var movable = function(entity, settings) {

                var en = entity, 
                    attrs = {
                        acceleration: (_.isUndefined(settings.acceleration) ? 1 : settings.acceleration), 
                        lastPos: { x: 0, y: 0 }
                    };

                this.steps = { 
                        max: 1, 
                        ctr: 0
                };

                this.getLastPos = function() {
                        return attrs.lastPos;
                };

                this.setLastPos = function(x, y) {
                        if(x >= 0) {
                                attrs.lastPos.x = x;
                        }
                        if(y >= 0) {
                                attrs.lastPos.y = y;
                        }
                };

                this.getNextPos = function(xDir, yDir) {
                        var xStep = en.attrs.x, 
                            yStep = en.attrs.y, 
                            newPos, 
                            speed = en.attrs.speed;

                        // set the directions on the entity
                        en.attrs.dir.x = xDir;
                        en.attrs.dir.y = yDir;

                        en.attrs.velocity.x += ((xDir * en.attrs.speed) - en.attrs.velocity.x) * attrs.acceleration;
                        en.attrs.velocity.y += ((yDir * en.attrs.speed) - en.attrs.velocity.y) * attrs.acceleration;

                        xStep += ~~((en.attrs.velocity.x * App.Game.moveDelta));
                        yStep += ~~((en.attrs.velocity.y * App.Game.moveDelta));

                        newPos = { x: xStep, y: yStep };

                        return newPos;
                };

                this.move = function(xDir, yDir) {

                        newPos = this.getNextPos(xDir, yDir);

                        attrs.lastPos.x = en.attrs.x;
                        attrs.lastPos.y = en.attrs.y;

                        en.setPosition(newPos.x, newPos.y);

                        if(xDir !== 0) {
                                en.changeState('walk');
                        } else {
                                en.changeState('idle');
                        }

                        return newPos;
                };
        };

        root.App.Objects.Components.Movable = movable;
        
})(this);
