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

                if(settings.init) {
                        settings.init(this);
                }
        };

        root.App.Objects.Components.Player = player;

})(this);
