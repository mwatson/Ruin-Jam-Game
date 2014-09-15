App.init = function() {

        App.Game = new App.Objects.Game();
        
        var settings = {

                // drawing/canvas settings
                draw: {
                        // all canvases must be the same width/height
                        width: 640, 
                        height: 480, 

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
                                fps: false, 
                                showDMap: false, 
                                drawTextMap: false, 

                                nwAllowInspector: true
                        }, 
                        fpscap: 60,
                        updatecap: 20, 

                        hud: {
                                titleFont: '64px PressStart', 
                                mainFont: '56px PressStart',
                                bigFont: '44px PressStart', 
                                medFont: '36px PressStart', 
                                midFont: '24px PressStart', 
                                smallFont: '16px PressStart'
                        }, 

                        // for lazy lookups
                        fontHeights: {
                                '64px PressStart': 64, 
                                '56px PressStart': 56, 
                                '44px PressStart': 44, 
                                '36px PressStart': 36, 
                                '24px PressStart': 24, 
                                '16px PressStart': 16, 
                                'bold 26px Courier New': 26,
                                'bold 12px Courier New': 12
                        }, 

                        sound: {
                                sfxVolume: 0.8, 
                                musicVolume: 0.7
                        }, 

                        video: {
                                width: 640, 
                                height: 480, 
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
