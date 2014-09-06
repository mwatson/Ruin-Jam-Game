(function(root) {

        // life objects will store all the info about a character's life, 
        // which are unlocked via the timer mechanisms

        // for now the timescale is (realtime to gametime): 
        // 1hr = 1.5mo
        // 60m = 90d
        // 1m = 0.667d

        var life = function() {

                var timers = {};

                this.addTimer = function(timerName, timerCount) {
                };

                this.removeTimer = function(timerName) {
                };
        };

        root.App.Objects.Life = life;

})(this);
