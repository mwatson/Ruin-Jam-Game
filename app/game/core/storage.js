(function(root){

        var storage = function() {

                this.check = function(key) {
                        if(_.isUndefined(localStorage[key])) {
                                return false;
                        }
                        return true;
                };

                this.get = function(key) {
                        if(this.check(key)) {
                                return localStorage[key];
                        }
                        return null;
                };

                this.set = function(key, value) {
                        localStorage[key] = value;
                };

                this.clear = function(key) {
                        if(this.check(key)) {
                                delete localStorage[key];
                        }
                };
        };

        var saveFile = function(settings) {

                this.settings = {};

                this.data = {};

                this.save = function() {
                        var saveData = _.cloneDeep(this.settings.save());
                        saveData._version = App.Game.version;
                        this.data = JSON.stringify(saveData);
                        App.Storage.set(this.settings.name, this.data);
                };

                this.load = function() {
                        this.data = JSON.parse(App.Storage.get(this.settings.name));
                        if(!this.data || (this.settings.versioned && (_.isUndefined(this.data._version) || this.data._version != App.Game.version))) {
                                this.purge();
                        } else {
                                delete this.data._version;
                                this.settings.load(this.data);
                        }
                };

                this.purge = function() {
                        App.Storage.clear(this.settings.name);
                };

                this.hasData = function() {
                        return App.Storage.check(this.settings.name);
                };

                this.init = (function(settings, self) {

                        self.settings = settings;

                })(settings, this);
        };

        root.App.Objects.Storage = storage;
        root.App.Objects.SaveFile = saveFile;

})(this);
