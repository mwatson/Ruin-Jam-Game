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

                this.init = function() {

                        function setPixel(imgData, x, y, r, g, b, a) {
                                var index = (x + y * imgData.width) * 4;
                                imgData.data[index +  0] = r;
                                imgData.data[index +  1] = g;
                                imgData.data[index +  2] = b;
                                imgData.data[index +  3] = a;
                        }

                        var props = App.Definitions.get('Entity', 'player');

                        props.x = 100;
                        props.y = 100;
                        props.type = 'player';

                        this.playerEnt = new App.Objects.Entity(props);

                        var c = document.createElement('canvas'), 
                            ctx = c.getContext('2d'), 
                            imgData;

                        c.width = 16;
                        c.height = 16;

                        imgData = ctx.createImageData(c.width, c.height);

                        var gId = this.playerEnt.c('Player').props.genderID;

                        var skin = App.Defs.PlayerSprites.skin[App.Tools.rand(0, App.Defs.PlayerSprites.skin.length - 1)], 
                            hair = { r: 106, g: 78, b: 66 }, 
                            shirt = { r: 233, g: 159, b: 0 }, 
                            shirtshadow = { r: 175, g: 119, b: 0 }, 
                            pants = { r: 0, g: 6, b: 81 }, 
                            eyes = { r: 0, g: 0, b: 0 }, 
                            grid = App.Defs.PlayerSprites[gId].adult;

                        for(var y = 0; y < grid.length; y++) {
                                for(var x = 0; x < grid[y].length; x++) {
                                        var cols;
                                        if(!grid[y][x]) {
                                                continue;
                                        }
                                        switch(grid[y][x]) {
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
                                        }
                                        setPixel(imgData, x, y, cols.r, cols.g, cols.b, 255);
                                }
                        }

                        ctx.putImageData(imgData, 0, 0);

                        this.playerEnt.c('Renderable').attrs.sprites.push(c);
                };

                this.setup = (function(self, settings) {
                    self.defaults = settings;
                })(this, settings);
        };

        root.App.Objects.Player = player;

})(this);
