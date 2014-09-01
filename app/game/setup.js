App.init = function() {

        App.Game = new App.Objects.Game();
        
        var settings = {

                // drawing/canvas settings
                draw: {
                        // all canvases must be the same width/height
                        width: 960, 
                        height: 720, 

                        // available ids: background, entity, hud, menu
                        canvases: [
                        { 
                                id: 'background', 
                                origin: 'dynamic'
                        }, 
                        { 
                                id: 'entity', 
                                origin: 'dynamic'
                        }, 
                        {
                                id: 'hud', 
                                origin: 'fixed'
                        }, 
                        {
                                id: 'transitions', 
                                origin: 'fixed'
                        }], 
                }, 

                // game default settings/options
                game: {

                        local: 'en', 
                        
                        debug: {
                                font: 'bold 26px Courier New', 
                                smFont: 'bold 12px Courier New',
                                fps: true, 
                                showDMap: false, 
                                drawTextMap: false, 

                                nwAllowInspector: true
                        }, 
                        fpscap: 60,
                        updatecap: 20, 

                        hud: {
                                titleFont: 'bold 64px PressStart', 
                                mainFont: 'bold 56px PressStart'
                        }, 

                        // for lazy lookups
                        fontHeights: {
                                'bold 64px PressStart': 64, 
                                'bold 56px PressStart': 56, 
                                'bold 26px Courier New': 26,
                                'bold 12px Courier New': 12
                        }, 

                        sound: {
                                sfxVolume: 0.8, 
                                musicVolume: 0.7
                        }, 

                        video: {
                                width: 960, 
                                height: 720, 
                                upscale: false
                        }
                }, 

                // player defaults
                player: {
                }
        };

        App.Game.init(settings);
};

document.addEventListener("DOMContentLoaded", function() {
        document.removeEventListener("DOMContentLoaded", arguments.callee, false);
        App.init();
});
