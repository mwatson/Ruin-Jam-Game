(function(root){

        var assets = {

                Loaded: {
                        Complete: false, 
                        Images: {}, 
                        CompositeImages: {}, 

                        Sounds: {}, 
                        Fonts: {}
                }, 

                Fonts: [
                        { name: 'PressStart' }
                ], 

                Images: [

                        //{ name: 'player1_1_idle_frame01', rel: 'img/players/player1_1.png', scale: 4 }, 
                ], 

                CompositeImages: [

                        /*{ name: 'soul_idle_frame01', 
                          images: [ 
                                { frame: 'soul_base01', offset: { x: 0, y: -2 } }
                          ]
                        }*/
                ], 

                Sounds: [
                        //{ name: 'pickup_soul', rel: 'sound/psoul.wav' }, 
                ], 

                SoundQueues: [
                        //{ name: 'explosion', sounds: [ 'explosion01', 'explosion02', 'explosion03', 'explosion04' ]}, 
                ], 

                Music: [

                        /*{ name: 'pumped', rel: { mp3: 'music/roccow_pumped.mp3' } }*/
                ]
        };

        root.App.Defaults.Assets = assets;

})(this);
