(function(root){

        var guidSave = {

                name: 'being-guid', 

                versioned: true, 

                save: function() {
                        return {
                                guid: App.Game.guid
                        };
                }, 

                load: function(saveData) {
                        if(!saveData) {
                                return;
                        }

                        App.Game.guid = saveData.guid;
                        Math.seedrandom(saveData.guid);
                        this.seed = Math.random;
                }
        };

        root.App.Defaults.Saves_GuidSave = guidSave;

        var playerSave = {

                name: 'being-player', 

                versioned: true, 

                save: function() {
                        return {
                                start: App.Player.playerEnt.c('Player').getStart(), 
                                position: {
                                        x: App.Player.playerEnt.attrs.x, 
                                        y: App.Player.playerEnt.attrs.y
                                }
                        };
                }, 

                load: function(saveData) {
                        if(!saveData) {
                                return;
                        }

                        App.Player.playerEnt.attrs.x = saveData.position.x;
                        App.Player.playerEnt.attrs.y = saveData.position.y;
                        App.Player.playerEnt.c('Player').setStart(saveData.start);
                }
        };

        root.App.Defaults.Saves_PlayerSave = playerSave;

})(this);
