(function(root){

        var player = function(settings) {

                this.playerEnt = null;

                this.run = function(collisions) {
                };

                this.haltPlayer = function() {
                        this.playerEnt.attrs.dir = { x: 0, y: 0 };
                };

                this.reset = function() {
                };

                function setPixel(imgData, x, y, r, g, b, a) {
                        var index = (x + y * imgData.width) * 4;
                        imgData.data[index +  0] = r;
                        imgData.data[index +  1] = g;
                        imgData.data[index +  2] = b;
                        imgData.data[index +  3] = a;
                }

                function generateHair(hairDone, hairGrid, x, y) {

                        if(!_.isUndefined(hairDone[x + '_' + y])) {
                                return 0;
                        }

                        if(_.isUndefined(hairGrid[y]) || _.isUndefined(hairGrid[y][x])) {
                                return 0;
                        }

                        hairDone[x + '_' + y] = [ x, y, 0 ];

                        if(hairGrid[y][x] == 0) {
                                return 0;
                        }

                        var ch = App.Tools.rand(1, 5);
                        if(ch > hairGrid[y][x]) {
                                return 0;
                        } else {
                                hairDone[x + '_' + y][2] = 1;
                        }

                        for(var i = -1; i <= 1; i++) {
                                for(var j = -1; j <= 1; j++) {
                                        if(j == 0 && i == 0) {
                                                continue;
                                        }
                                        generateHair(hairDone, hairGrid, x + j, y + i);
                                }
                        }

                        return 1;
                }


                function hairGridStart(hairGrid) {
                        var hairStart = { x: -1, y: -1 };
                        for(var y = 0; y < hairGrid.length; y++) {
                                for(var x = 0; x < hairGrid[y].length; x++) {
                                        if(hairGrid[y][x] == 5) {
                                                hairStart.x = x;
                                                hairStart.y = y;
                                                break;
                                        }
                                }
                                if(hairStart.x >= 0 && hairStart.y >= 0) {
                                        break;
                                }
                        }

                        return hairStart;
                }

                this.init = function() {

                        var props = App.Definitions.get('Entity', 'player'), 
                            stages = [
                                'baby', 
                                'child', 
                                'teen', 
                                'adult', 
                                'elderly'
                            ];

                        props.x = 100;
                        props.y = 100;
                        props.type = 'player';

                        this.playerEnt = new App.Objects.Entity(props);

                        var gId = this.playerEnt.c('Player').props.genderID, 
                            rSkin = App.Tools.rand(0, App.Defs.PlayerSprites.skin.length - 1), 
                            skin = App.Defs.PlayerSprites.skin[rSkin], 
                            rHair = App.Tools.rand(0, App.Defs.PlayerSprites.hair.length - 1), 
                            hair = App.Defs.PlayerSprites.hair[rHair], 
                            rOldHair = App.Tools.rand(0, App.Defs.PlayerSprites.oldHair.length - 1), 
                            oldHair = App.Defs.PlayerSprites.oldHair[rOldHair], 
                            rEyes = App.Tools.rand(0, App.Defs.PlayerSprites.eyes.length - 1), 
                            eyes = App.Defs.PlayerSprites.eyes[rEyes], 
                            shirt = { r: 0, g: 0, b: 0 }, 
                            shirtshadow = { r: 0, g: 0, b: 0 }, 
                            pants = { r: 0, g: 0, b: 0 }, 
                            pantsdark = { r: 0, g: 0, b: 0 }, 
                            bodyGrid = false, 
                            hairGrid = false, 
                            i, x, y, g, its, hairSel, 
                            hairDone = {}, 
                            scratch, scCtx;

                        shirt.r = App.Tools.rand(0, 255);
                        shirt.g = App.Tools.rand(0, 255);
                        shirt.b = App.Tools.rand(0, 255);

                        shirtshadow.r = Math.floor((shirt.r + 32) / 2);
                        shirtshadow.g = Math.floor((shirt.g + 32) / 2);
                        shirtshadow.b = Math.floor((shirt.b + 32) / 2);

                        pants.r = App.Tools.rand(0, 255);
                        pants.g = App.Tools.rand(0, 255);
                        pants.b = App.Tools.rand(0, 255);

                        var bgCol = 'rgba(' + 
                                ((255 ^ pants.r) | 192) + ',' + 
                                ((255 ^ pants.g) | 192) + ',' + 
                                ((255 ^ pants.b) | 192) + ',1)';

                        App.Draw.get('background').setBgColor(bgCol);

                        pantsdark.r = Math.floor((pants.r + 32) / 2);
                        pantsdark.g = Math.floor((pants.g + 32) / 2);
                        pantsdark.b = Math.floor((pants.b + 32) / 2);

                        for(i = 0; i < stages.length; i++) {

                                bodyGrid = App.Defs.PlayerSprites[gId][stages[i]].bodyMap;
                                hairGrid = App.Defs.PlayerSprites[gId][stages[i]].hairMap;

                                hairDone = {};
                                hairStart = hairGridStart(hairGrid);
                                generateHair(hairDone, hairGrid, hairStart.x, hairStart.y);

                                for(g = 0; g < bodyGrid.length; g++) {

                                        var c = document.createElement('canvas'), 
                                            ctx = c.getContext('2d'), 
                                            imgData;

                                        c.width = 32;
                                        c.height = 16;

                                        imgData = ctx.createImageData(c.width, c.height);


                                        for(y = 0; y < bodyGrid[g].length; y++) {
                                                for(x = 0; x < bodyGrid[g][y].length; x++) {
                                                        var cols;

                                                        if(!bodyGrid[g][y][x]) {
                                                                continue;
                                                        }
                                                        switch(bodyGrid[g][y][x]) {
                                                                case 1:
                                                                        cols = skin;
                                                                        break;
                                                                case 2:
                                                                        cols = eyes;
                                                                        break;
                                                                case 3:
                                                                        cols = shirt;
                                                                        break;
                                                                case 4:
                                                                        cols = shirtshadow;
                                                                        break;
                                                                case 5:
                                                                        cols = pants;
                                                                        break;
                                                                case 6:
                                                                        cols = pantsdark;
                                                                        break;
                                                        }

                                                        setPixel(imgData, x, y, cols.r, cols.g, cols.b, 255);
                                                }
                                        }

                                        if(stages[i] == "elderly") {
                                                hairSel = _.clone(oldHair);
                                        } else {
                                                hairSel = _.clone(hair);
                                        }

                                        for(x in hairDone) {
                                                if(hairDone[x].hasOwnProperty()) {
                                                        continue;
                                                }
                                                if(!hairDone[x][2]) {
                                                        continue;
                                                }
                                                setPixel(imgData, hairDone[x][0], hairDone[x][1], hairSel.r, hairSel.g, hairSel.b, 255);
                                        }

                                        scratch = document.createElement('canvas');
                                        scCtx = scratch.getContext('2d');

                                        scratch.width = 16;
                                        scratch.height = 16;

                                        scCtx.putImageData(imgData, 0, 0);
                                        ctx.drawImage(scratch, 0, 0, 16, 16, 0, 0, 16, 16);

                                        scCtx.clearRect(0, 0, 16, 16);
                                        scCtx.scale(-1, 1);
                                        scCtx.drawImage(c, -16, 0);

                                        ctx.drawImage(scratch, 0, 0, 16, 16, 16, 0, 16, 16);

                                        var st = 'idle';
                                        if(g == 0) {
                                                st = 'idle';
                                        } else if(g <= 2) {
                                                st = 'walk';
                                        }

                                        if(_.isUndefined(this.playerEnt.c('Renderable').attrs.sprites[stages[i]])) {
                                                this.playerEnt.c('Renderable').attrs.sprites[stages[i]] = {};
                                        }
                                        if(_.isUndefined(this.playerEnt.c('Renderable').attrs.sprites[stages[i]][st])) {
                                                this.playerEnt.c('Renderable').attrs.sprites[stages[i]][st] = [];
                                        }

                                        this.playerEnt.c('Renderable').attrs.sprites[stages[i]][st].push({
                                                frame: c, 
                                                duration: 100
                                        });
                                }
                        }

                        var playerProps = this.playerEnt.c('Player').props, 
                            deathSprite = null, 
                            scr = null, 
                            dsCtx, 
                            sp;

                        if(playerProps.life >= 60) {
                                sp = 'elderly';
                        } else if(playerProps.life >= 20) {
                                sp = 'adult';
                        } else if(playerProps.life >= 12) {
                                sp = 'teen';
                        } else if(playerProps.life >= 4) {
                                sp = 'child';
                        } else {
                                sp = 'baby';
                        }

                        deathSprite = this.playerEnt.c('Renderable').attrs.sprites[sp].idle[0].frame;

                        scratch = document.createElement('canvas');
                        scCtx = scratch.getContext('2d');
                        scCtx.translate(8, 8);
                        scCtx.rotate(-90 * Math.PI / 180);
                        scCtx.drawImage(deathSprite, -12, -8);

                        this.playerEnt.c('Renderable').attrs.sprites.death = {
                                idle: [{
                                        frame: scratch, 
                                        duration: 100
                                }]
                        };
                };

                this.setup = (function(self, settings) {
                    self.defaults = settings;
                })(this, settings);
        };

        root.App.Objects.Player = player;

})(this);
