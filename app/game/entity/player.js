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
                        c.id = 'player_sprite';

                        imgData = ctx.createImageData(c.width, c.height);

                        var skin = { r: 235, g: 199, b: 161 };
                };

                this.setup = (function(self, settings) {
                    self.defaults = settings;
                })(this, settings);
        };

        root.App.Objects.Player = player;

})(this);
