(function(root) {

        var entities = {

                //
                // All entity definitions go here
                //

                player: {
                        width: 96, 
                        height: 96, 
                        speed: 1.5, 
                        components: {
                                Renderable: {
                                        color: '#000'
                                }, 
                                Movable: {
                                        acceleration: 0.2
                                }, 
                                Player: {
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
