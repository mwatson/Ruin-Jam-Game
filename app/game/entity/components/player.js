(function(root){

        var player = function(entity, settings) {

                this.en = entity;

                this.props = {
                        life: 75, 
                        gender: 0, // scale of 0 (cis) - 100 (trans)
                        genderID: '',
                        sexuality: 0, // scale of 0 (straight) - 100 (gay)
                        skin: '', 
                        hair: ''
                };

                var target = { x: -1, y: -1 };

                this.behavior = function() {

                        var xDir, yDir, xDiff, yDiff;

                        if(target.x < 0 && target.y < 0) {
                                target.x = App.Tools.rand(75, 565);
                                target.y = App.Tools.rand(75, 405);
                        }

                        xDiff = Math.abs(target.x - this.en.attrs.x);
                        if(target.x > this.en.attrs.x && xDiff > 16) {
                                xDir = 1;
                        } else if(target.x < this.en.attrs.x && xDiff > 16) {
                                xDir = -1;
                        } else {
                                xDir = 0;
                                target.x = -1;
                        }

                        yDiff = Math.abs(target.y - this.en.attrs.y);
                        if(target.y > this.en.attrs.y && yDiff > 16) {
                                yDir = 1;
                        } else if(target.y < this.en.attrs.y && yDiff > 16) {
                                yDir = -1;
                        } else {
                                yDir = 0;
                                target.y = -1;
                        }

                        this.en.c('Movable').move(xDir, yDir);
                };

                if(settings.init) {
                        settings.init(this);
                }
        };

        root.App.Objects.Components.Player = player;

})(this);
