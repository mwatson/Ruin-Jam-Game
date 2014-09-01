(function(root) {

        var entity = function(settings) {

                this.attrs = {
                        id: -1, 
                        x: 0, 
                        y: 0, 
                        width: 0, 
                        height: 0, 
                        speed: 0, 

                        velocity: {
                                x: 0, 
                                y: 0
                        }, 
                        dir: {
                                x: 0, 
                                y: 0
                        }
                };

                this.state = 'idle';
                this.prevState = 'idle';

                this.removed = false;

                this.center = function() {
                        return {
                                x: this.attrs.x + this.attrs.width / 2, 
                                y: this.attrs.y + this.attrs.height / 2
                        };
                };

                var components = {};

                this.c = function(component) {
                        if(!_.isUndefined(components[component])) {
                                return components[component];
                        }
                        return false;
                };

                this.is = function(component) {
                        if(!_.isUndefined(components[component])) {
                                return true;
                        }
                        return false;
                };

                this.addComponent = function(componentType, settings) {
                        if(_.isUndefined(App.Objects.Components[componentType])) {
                                return false;
                        }

                        if(!_.isUndefined(components[componentType])) {
                                this.removeComponent(componentType);
                        }
                        
                        components[componentType] = new App.Objects.Components[componentType](this, settings);
                };

                this.removeComponent = function(componentType) {
                        if(!_.isUndefined(components[componentType])) {
                                delete components[componentType];
                        }
                };

                this.showComponents = function() {
                        return _.keys(components);
                };

                this.setPosition = function(x, y) {
                        this.attrs.x = x;
                        this.attrs.y = y;
                };

                this.changeState = function(newState, callback) {
                        if(this.state == newState) {
                                return false;
                        }

                        this.prevState = this.state;
                        this.state = newState;
                        if(callback) {
                                callback();
                        }

                        return true;
                };

                // flag for removal
                this.removeEntity = function(callback) {
                        this.removed = true;

                        if(this.is('Pooled')) {
                                App.World.map.returnToPool(this.c('Pooled').pool, this.attrs.id);
                        }

                        if(_.isFunction(callback)) {
                                callback(this);
                        }
                };

                this.getTile = function() {
                        return {
                                x: Math.floor(this.attrs.x / 64), 
                                y: Math.floor(this.attrs.y / 64)
                        };
                };

                var futureEvents = [];
                this.addEvent = function(turns, callback) {
                        futureEvents.push({
                                turns: turns, 
                                callback: callback
                        });
                };

                this.runEvents = function() {
                        var i;
                        for(i = 0; i < futureEvents.length; i++) {
                                if(futureEvents[i].turns === 0) {
                                        futureEvents[i].callback(this);
                                        futureEvents[i].turns--;
                                } else if(futureEvents[i].turns > 0) {
                                        futureEvents[i].turns--;
                                }
                        }
                };

                this.getEvents = function() {
                        return futureEvents;
                };

                // completely remove all components etc for an entity
                this.shutdown = function() {
                        var i, comps = this.showComponents();
                        for(i = 0; i < comps.length; i++) {
                                this.removeComponent(comps[i]);
                        }

                        for(i = 0; i < futureEvents.length; i++) {
                                delete futureEvents[i];
                        }

                        futureEvents = [];
                };                

                this.init = (function(settings, self){

                        self.attrs.id = settings.id;
                        self.attrs.width = settings.width;
                        self.attrs.height = settings.height;
                        self.attrs.x = settings.x;
                        self.attrs.y = settings.y;
                        self.attrs.speed = settings.speed;

                        _.each(settings.components, function(cdata, cname){
                                self.addComponent(cname, cdata);
                        });

                })(settings, this);
        };

        root.App.Objects.Entity = entity;

        root.App.Objects.Components = {};

        var pooled = function(entity, settings) {

                this.en = entity;
                this.pool = settings.pool;

                var poolId = null;

                this.setPoolId = function(pId) {
                        poolId = pId;
                };
        };

        root.App.Objects.Components.Pooled = pooled;

        var pickup = function(entity, settings) {

                var onPickupDef = function(){ return true; }, 
                    pickupSound = 'pickup';
                
                if(!_.isUndefined(settings.onPickup)) {
                        onPickupDef = settings.onPickup;
                }

                if(!_.isUndefined(settings.soundPickup)) {
                        pickupSound = settings.soundPickup;
                }

                this.en = entity;

                this.onPickup = function(en){
                        if(onPickupDef(en, this.en)) {
                                if(pickupSound.length) {
                                        App.Sound.play(pickupSound);
                                }
                                this.en.removeEntity();
                                return true;
                        }
                        return false;
                };
        };

        root.App.Objects.Components.Pickup = pickup;

})(this);
