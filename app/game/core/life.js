(function(root) {

        // life objects will store all the info about a character's life, 
        // which are unlocked via the timer mechanisms

        // for now the timescale is (realtime to gametime): 
        // 1m = 1d
        // 1h = 60d
        // 1d = 1440d, ~4yrs

        // common gametimes to real times
        // 85yrs = ~21d
        // 65yrs = ~16d
        // 10yrs = 2.5d
        // 20yrs = 5d
        // 1yr = 6hr

        var life = function() {

        };

        root.App.Objects.Life = life;

})(this);
