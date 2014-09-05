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

                this.init = function() {

                        var props = App.Definitions.get('Entity', 'player');

                        props.x = 100;
                        props.y = 100;
                        props.type = 'player';

                        this.playerEnt = new App.Objects.Entity(props);

                        var gId = this.playerEnt.c('Player').props.genderID, 
                            rSkin = App.Tools.rand(0, App.Defs.PlayerSprites.skin.length - 1), 
                            skin = App.Defs.PlayerSprites.skin[rSkin], 
                            rHair = App.Tools.rand(0, App.Defs.PlayerSprites.hair.length - 1), 
                            hair = App.Defs.PlayerSprites.hair[rHair], 
                            shirt = { r: 0, g: 0, b: 0 }, 
                            shirtshadow = { r: 0, g: 0, b: 0 }, 
                            pants = { r: 0, g: 0, b: 0 }, 
                            pantsdark = { r: 0, g: 0, b: 0 }, 
                            eyes = { r: 0, g: 0, b: 0 }, 
                            bodyGrid = App.Defs.PlayerSprites[gId].adult.bodyMap, 
                            hairGrid = App.Defs.PlayerSprites[gId].adult.hairMap, 
                            x, y, g, its, 
                            hairDone = {};

                        shirt.r = App.Tools.rand(0, 255);
                        shirt.g = App.Tools.rand(0, 255);
                        shirt.b = App.Tools.rand(0, 255);

                        shirtshadow.r = Math.floor((shirt.r + 32) / 2);
                        shirtshadow.g = Math.floor((shirt.g + 32) / 2);
                        shirtshadow.b = Math.floor((shirt.b + 32) / 2);

                        pants.r = App.Tools.rand(0, 255);
                        pants.g = App.Tools.rand(0, 255);
                        pants.b = App.Tools.rand(0, 255);

                        pantsdark.r = Math.floor((pants.r + 32) / 2);
                        pantsdark.g = Math.floor((pants.g + 32) / 2);
                        pantsdark.b = Math.floor((pants.b + 32) / 2);

                        generateHair(hairDone, hairGrid, 5, 1);

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

                                for(x in hairDone) {
                                        if(hairDone[x].hasOwnProperty()) {
                                                continue;
                                        }
                                        if(!hairDone[x][2]) {
                                                continue;
                                        }
                                        setPixel(imgData, hairDone[x][0], hairDone[x][1], hair.r, hair.g, hair.b, 255);
                                }

                                var scratch = document.createElement('canvas'), 
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

                                this.playerEnt.c('Renderable').attrs.sprites[st].push({
                                        frame: c, 
                                        duration: 100
                                });
                        }
                };

                this.setup = (function(self, settings) {
                    self.defaults = settings;
                })(this, settings);
        };

        root.App.Objects.Player = player;

})(this);
