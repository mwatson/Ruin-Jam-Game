(function(root){

        var movable = function(entity, settings) {

                var en = entity, 
                    attrs = {
                        acceleration: (_.isUndefined(settings.acceleration) ? 1 : settings.acceleration), 
                        lastPos: { x: 0, y: 0 }
                    }, 
                    TILES = App.Defaults.Tiles;

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

                        if(en.is('Collidable')) {
                                newPos = en.c('Collidable').checkMapCollision(xStep, yStep);
                        } else {
                                newPos = { x: xStep, y: yStep };
                        }

                        return newPos;
                };

                this.move = function(xDir, yDir) {

                        newPos = this.getNextPos(xDir, yDir);

                        attrs.lastPos.x = en.attrs.x;
                        attrs.lastPos.y = en.attrs.y;

                        en.setPosition(newPos.x, newPos.y);

                        if(en.is('Hurtable') && en.c('Hurtable').isDead()) {
                                // don't change state if the entity is dead
                        } else if(xDir !== 0) {
                                en.changeState('walk');
                        } else {
                                en.changeState('idle');
                        }

                        return newPos;
                };

                var targetTile = en.getTile();
                this.setTargetTile = function(x, y) {
                        if(_.isUndefined(App.World.map.grid[y])) {
                                return false;
                        }

                        if(_.isUndefined(App.World.map.grid[y][x])) {
                                return false;
                        }

                        if(App.World.map.grid[y][x].type >= TILES.BLOCK) {
                                return false;
                        }

                        // there's a friendly/player in that square
                        if(App.World.map.dMaps.player[y][x] === 0) {
                                if(en.is('IsEnemy') && en.c('IsEnemy').isFriendly()) {
                                        return false;
                                }
                                if(en.is('IsPlayer')) {
                                        return false;
                                }
                        }

                        // attack an enemy
                        if(App.World.map.dMaps.player[y][x] == 500) {
                                if(en.is('IsPlayer')) {
                                        return en.c('IsPlayer').targetEnemyInTile(x, y);
                                }
                                return false;
                        }

                        targetTile.x = x;
                        targetTile.y = y;
                        return true;
                };

                this.hasTarget = function() {
                        var enTile = en.getTile(),
                            targetX = targetTile.x * 64;//App.World.map.tileSize, 
                            targetY = targetTile.y * 64;//App.World.map.tileSize;
                        if(targetX == en.attrs.x && targetY == en.attrs.y) {
                                return false;
                        }
                        return true;
                };

                this.getTarget = function() {
                        return targetTile;
                };

                this.moveToTile = function() {
                        var xDir = 0, 
                            yDir = 0, 
                            targetX = targetTile.x * App.World.map.tileSize, 
                            targetY = targetTile.y * App.World.map.tileSize;

                        if(targetX < en.attrs.x) {
                                xDir = -1;
                        } else if(targetX > en.attrs.x) {
                                xDir = 1;
                        }

                        if(targetY < en.attrs.y) {
                                yDir = -1;
                        } else if(targetY > en.attrs.y) {
                                yDir = 1;
                        }

                        newPos = this.getNextPos(xDir, yDir);

                        if(xDir < 0 && newPos.x < targetX) {
                                newPos.x = targetX;
                        } else if(xDir > 0 && newPos.x > targetX) {
                                newPos.x = targetX;
                        }

                        if(yDir < 0 && newPos.y < targetY) {
                                newPos.y = targetY;
                        } else if(yDir > 0 && newPos.y > targetY) {
                                newPos.y = targetY;
                        }

                        attrs.lastPos.x = en.attrs.x;
                        attrs.lastPos.y = en.attrs.y;

                        en.setPosition(newPos.x, newPos.y);
                };

                this.lowestAdjacentTile = function(tile, dmap) {
                        var lowVal = App.World.map.dMaps[dmap][tile.y][tile.x], 
                            tiles = [[0, 1], [0, -1], [1, 0], [-1, 0]], 
                            tX, tY, lowTile = { x: 0, y: 0 };

                        for(var i = 0; i < tiles.length; i++) {
                                tX = tile.x + tiles[i][0];
                                tY = tile.y + tiles[i][1];
                                if(App.World.map.dMaps[dmap][tY][tX] < lowVal) {
                                        lowTile.x = tX;
                                        lowTile.y = tY;
                                        lowVal = App.World.map.dMaps[dmap][tY][tX];
                                }
                        }
                        return lowTile;
                };
        };

        root.App.Objects.Components.Movable = movable;
        
})(this);
