(function(root){

        var gameSave = {

                name: 'being-game', 

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

                        console.log('harf', saveData);

                        App.Game.guid = saveData.guid;
                        Math.seedrandom(saveData.guid);
                        this.seed = Math.random;
                }
        };

        root.App.Defaults.Saves_GameSave = gameSave;

})(this);
