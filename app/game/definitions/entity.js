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
                                        color: '#000'
                                }, 
                                Movable: {
                                }, 
                                IsPlayer: {
                                        damage: 1, // close attack damage (not bomb damage)
                                        explodeDamage: 2, // exploding damage for ghosts that can explode
                                        init: function(en) {
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
                                IsCamera: {
                                }
                        }
                }
        };

        root.App.Defaults.Entity = entities;

})(this);
