(function(root) {

        var entities = {

                //
                // All entity definitions go here
                //

                player: {
                        width: 64, 
                        height: 64, 
                        speed: 8, 
                        components: {
                                Renderable: {
                                        color: '#000',
                                        sprites: 'player'
                                }, 
                                Movable: {
                                }, 
                                Player: {
                                        init: function(c) {

                                                c.props.life = App.Tools.rand(0, 115);
                                                c.props.gender = App.Tools.rand(0, 100);
                                                c.props.genderID = App.Tools.rand(0, 1) ? 'M' : 'F';
                                                c.props.sexuality = App.Tools.rand(0, 100);
                                        }
                                }
                        }
                }, 

                camera: {
                        width: 64, 
                        height: 64, 
                        speed: 6, 
                        components: {
                                Movable: {
                                        acceleration: 0.4
                                },
                                Camera: {
                                }
                        }
                }
        };

        root.App.Defaults.Entity = entities;

})(this);
