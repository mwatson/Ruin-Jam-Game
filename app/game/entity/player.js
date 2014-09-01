(function(root){

        var player = function(settings) {

                this.defaults = {};

                this.inventory = {};

                this.playerEnt = null;

                this.run = function(collisions) {
                };

                this.haltPlayer = function() {
                        this.playerEnt.attrs.dir = { x: 0, y: 0 };
                };

                this.unsetState = function() {
                        state.set = false;
                };

                this.saveState = function() {
                        state.spriteSet = this.playerEnt.c('Renderable').attrs.spriteSet;
                        state.health    = this.playerEnt.c('Hurtable').health;
                        state.maxHealth = this.playerEnt.c('Hurtable').maxHealth;
                        state.bombs     = this.playerEnt.c('HasProjectile').getInventory();
                        state.maxBombs  = this.playerEnt.c('HasProjectile').getMaxInventory();
                        state.souls     = this.playerEnt.c('IsPlayer').getActCurrency();
                        state.maxSouls  = this.playerEnt.c('IsPlayer').getActCurrencyMax();
                        state.secState  = this.playerEnt.c('IsPlayer').secondaryState; 

                        state.set = true;
                };

                this.restoreState = function() {
                        if(!this.hasState()) {
                                return false;
                        }

                        // make sure you set the maximums before filling in the current values
                        this.playerEnt.c('Renderable').setSprites(state.spriteSet);
                        this.playerEnt.c('Hurtable').maxHealth = state.maxHealth;
                        this.playerEnt.c('Hurtable').health = state.health;
                        this.playerEnt.c('HasProjectile').setMaxInventory(state.maxBombs);
                        this.playerEnt.c('HasProjectile').setInventory(state.bombs);
                        this.playerEnt.c('IsPlayer').secondaryState = state.secState;
                        this.playerEnt.c('IsPlayer').setActCurrencyMax(state.maxSouls);
                        this.playerEnt.c('IsPlayer').addActCurrency(state.souls);

                        return true;
                };

                this.reset = function() {
                };

                this.init = function() {
                };

                this.setup = (function(self, settings) {
                    self.defaults = settings;
                })(this, settings);
        };

        root.App.Objects.Player = player;

})(this);
