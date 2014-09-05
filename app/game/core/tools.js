(function(root){

        var tools = function() {

                this.rand = function(low, high) {
                        return Math.floor(Math.random() * (high - low + 1)) + low;
                };

                this.guid = function() {
                        var d = performance.now();
                        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                                var r = (d + Math.random()*16)%16 | 0;
                                d = Math.floor(d / 16);
                                return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
                        });
                        return uuid;
                };
        
                this.log = function() {
                        console.log(arguments);
                };

                this.shuffle = function(arr) {
                        for(var i = arr.length - 1; i > 0; i--) {
                                var j = Math.floor(Math.random() * (i + 1));
                                var t = arr[i];
                                arr[i] = arr[j];
                                arr[j] = t;
                        }
                        return arr;
                };

                this.debugColor = '#000';

                this.printFPS = function(ontoLayer, counts) {
                        var avgs = {};
                        _.each(counts, function(val, key) {
                                avgs[key] = 0;
                                _.each(val, function(v) {
                                        avgs[key] += v;
                                });
                                avgs[key] = 1000 / (avgs[key] / val.length);
                                avgs[key] = Math.round(avgs[key]);
                        });

                        var canvas = App.Draw.get(ontoLayer);
                        /*
                        canvas.writeDirect(
                                avgs.draw + ' fps', 
                                App.Game.settings.debug.font, 
                                this.debugColor, 
                                canvas.width() - 140, 
                                canvas.height() - 100
                        );
                        canvas.writeDirect(
                                avgs.update + ' ups', 
                                App.Game.settings.debug.font, 
                                this.debugColor, 
                                canvas.width() - 140, 
                                canvas.height() - 60
                        );
                        */
                        canvas.writeText(
                                App.Game.versionString, 
                                App.Game.settings.debug.font, 
                                this.debugColor, 
                                180, 
                                20
                        );
                };

                this.printEntityPos = function(ontoLayer, entity) {
                        if(!entity) {
                                return;
                        }
                        var canvas = App.Draw.get(ontoLayer);
                        canvas.writeDirect(
                                'X: ' + entity.attrs.x, 
                                App.Game.settings.debug.font, 
                                this.debugColor, 
                                canvas.width() - 60, 
                                canvas.height() - 100
                        );
                        canvas.writeDirect(
                                'Y: ' + entity.attrs.y, 
                                App.Game.settings.debug.font, 
                                this.debugColor, 
                                canvas.width() - 60, 
                                canvas.height() - 80
                        );
                };

                this.assetLoader = function() {
                        var self = this;

                        _.each(App.Defs.Assets.Fonts, function(asset, id) {
                                App.Assets.Fonts[asset.name] = {
                                        initWidth: App.Draw.get('hud').measureText('amazing awesome!', '24px ' + asset.name), 
                                        loaded: false
                                };
                        });

                        _.each(App.Defs.Assets.Images, function(asset, id) {
                                App.Assets.Images[asset.name] = new Image();
                                App.Assets.Images[asset.name].onload = function() {
                                        var c = document.createElement('canvas'), 
                                            ctx, 
                                            scale = _.isUndefined(asset.scale) ? 1 : asset.scale;

                                        c.id = asset.name;
                                        c.width = this.width * scale;
                                        c.height = this.height * scale;
                                        ctx = c.getContext('2d');

                                        ctx.imageSmoothingEnabled = false;
                                        
                                        ctx.drawImage(
                                                App.Assets.Images[asset.name],
                                                0,
                                                0,
                                                c.width, 
                                                c.height 
                                        );

                                        App.Assets.Images[asset.name] = c;
                                        App.Defs.Assets.Loaded.Images[asset.name] = true;

                                        if(_.keys(App.Defs.Assets.Loaded.Images).length == App.Defs.Assets.Images.length) {
                                                App.Tools.buildComposites();
                                        }
                                };
                                App.Assets.Images[asset.name].src = 'assets/' + asset.rel;
                        });

                        _.each(App.Defs.Assets.Sounds, function(asset, id) {
                                App.Assets.Sounds[asset.name] = new Audio();
                                App.Assets.Sounds[asset.name].addEventListener('canplay', function() {
                                        App.Defs.Assets.Loaded.Sounds[asset.name] = true;
                                        App.Defs.Assets.Loaded.Complete = self.assetsCheckComplete();
                                });
                                App.Assets.Sounds[asset.name].src = 'assets/' + asset.rel;
                                App.Assets.Sounds[asset.name].load();
                        });

                        _.each(App.Defs.Assets.SoundQueues, function(asset, id) {
                                App.Assets.SoundQueues[asset.name] = new App.Objects.SoundQueue(asset.sounds);
                        });

                        // music doesn't count for/against the asset count
                        _.each(App.Defs.Assets.Music, function(asset, id) {
                                App.Assets.Music[asset.name] = new Audio();
                                // check here for mp3 compat
                                App.Assets.Music[asset.name].src = 'assets/' + asset.rel.mp3;
                                App.Assets.Music[asset.name].playing = false;
                        });
                };

                this.assetFontCheck = function() {
                        var w, self = this;
                        _.each(App.Defs.Assets.Fonts, function(asset, id) {
                                if(!App.Assets.Fonts[asset.name].loaded) {
                                        w = App.Draw.get('hud').measureText('amazing awesome!', '24px ' + asset.name);
                                        // hmm
                                        if(App.Assets.Fonts[asset.name].initWidth.width != w.width) {
                                                App.Assets.Fonts[asset.name].loaded = true;
                                                App.Defs.Assets.Loaded.Fonts[asset.name] = true;
                                                App.Defs.Assets.Loaded.Complete = self.assetsCheckComplete();
                                        }
                                }
                        });
                };

                this.assetsCheckComplete = function() {
                        return (
                                _.keys(App.Defs.Assets.Loaded.CompositeImages).length == App.Defs.Assets.CompositeImages.length && 
                                _.keys(App.Defs.Assets.Loaded.Images).length == App.Defs.Assets.Images.length && 
                                _.keys(App.Defs.Assets.Loaded.Sounds).length == App.Defs.Assets.Sounds.length && 
                                _.keys(App.Defs.Assets.Loaded.Fonts).length == App.Defs.Assets.Fonts.length
                        );
                };

                this.buildComposites = function() {
                        var self = this;
                        _.each(App.Defs.Assets.CompositeImages, function(asset, id) {
                                var c = document.createElement('canvas');
                                c.id = asset.name;
                                c.width = App.Assets.Images[asset.images[0].frame].width;
                                c.height = App.Assets.Images[asset.images[0].frame].height;

                                self.compositeImages(asset.images, c);

                                App.Assets.Images[asset.name] = c;
                                App.Defs.Assets.Loaded.CompositeImages[asset.name] = true;

                                App.Defs.Assets.Loaded.Complete = self.assetsCheckComplete();
                        });

                        if(!App.Defs.Assets.CompositeImages.length) {
                                App.Defs.Assets.Loaded.Complete = self.assetsCheckComplete();
                        }
                };

                this.clearCompositeCanvas = function(canvas) {
                        var ctx = canvas.getContext('2d');
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                };

                this.compositeImages = function(images, canvas) {
                        var ctx = canvas.getContext('2d');
                        for(var i = 0; i < images.length; i++) {
                                if(!images[i]) {
                                        continue;
                                }
                                ctx.drawImage(
                                        App.Assets.Images[images[i].frame],
                                        images[i].offset.x,
                                        images[i].offset.y
                                );
                        }
                        return true;
                };

                // for lack of a better place
                this.colorBackground = function(color) {
                        App.Draw.get('deepBackground').fillRect(
                            0, 0, 1280, 720, color
                        );
                };

                this.boxesIntersect = function(x1, y1, w1, h1, x2, y2, w2, h2) {
                                if(x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2) {
                                        return true;
                                }
                                return false;
                };

                this.getString = function(str) {
                        var local = App.Game.settings.local;
                        if(!_.isUndefined(App.Defs.Strings) && !_.isUndefined(App.Defs.Strings[local]) && !_.isUndefined(App.Defs.Strings[local][str])) {
                                return App.Defs.Strings[local][str];
                        }
                        return str;
                };

                this.formatNumber = function(n, decPlaces, thouSeparator, decSeparator) {
                        decPlaces = isNaN(decPlaces = Math.abs(decPlaces)) ? 2 : decPlaces;
                        decSeparator = decSeparator === undefined ? "." : decSeparator;
                        thouSeparator = thouSeparator === undefined ? "," : thouSeparator;
                        var sign = n < 0 ? "-" : "",
                        i = parseInt(n = Math.abs(+n || 0).toFixed(decPlaces), 10) + "",
                        j = (j = i.length) > 3 ? j % 3 : 0;
                        return sign + (j ? i.substr(0, j) + thouSeparator : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thouSeparator) + (decPlaces ? decSeparator + Math.abs(n - i).toFixed(decPlaces).slice(2) : "");
                };

                this.spawnEmitter = function(x, y) {
                        var pId = App.World.map.fromPool(
                                'explosion', 
                                x * App.World.map.tileSize, 
                                y * App.World.map.tileSize
                        );

                        if(pId) {
                                App.World.map.entities[pId].c('Emitter').init();
                                App.World.map.entities[pId].c('Emitter').enable();
                        }

                        return pId;
                };

                this.spawnExplosion = function(x, y) {
                        var pId = App.World.map.fromPool(
                                'explosion', 
                                x * App.World.map.tileSize, 
                                y * App.World.map.tileSize
                        );

                        if(pId) {
                                App.World.map.entities[pId].c('Emitter').init();
                                App.World.map.entities[pId].c('Emitter').enable();
                        }

                        return pId;
                };

                this.getRadius = function(radius) {
                        var coords = [], 
                            min, max;
                        for(var r = 0; r <= radius; r++) {
                                max = r;
                                min = 0;
                                while(min <= max) {
                                        coords.push([min, max]);
                                        if(min != max) {
                                                coords.push([max, min]);
                                        }
                                        min++;
                                        max--;
                                }
                        }

                        return coords;
                };

                // lame helper function
                this.execInRadius = function(coords, pos, callback) {
                        var TILES = App.Defaults.Tiles, 
                            dirty = [], 
                            curX, 
                            curY, 
                            i, x, y;
                        for(i = 0; i < coords.length; i++) {
                                curX = coords[i][0];
                                curY = coords[i][1];
                                if(App.World.map.setGrid(pos.x + curX, pos.y + curY, TILES.CLEAR, TILES.CLEAR, TILES.BLOCK)) {
                                        callback(pos.x + curX, pos.y + curY);
                                        dirty.push([ pos.x + curX, pos.y + curY ]);
                                }
                                if(curX > 0) {
                                        if(App.World.map.setGrid(pos.x - curX, pos.y + curY, TILES.CLEAR, TILES.CLEAR, TILES.BLOCK)) {
                                                callback(pos.x - curX, pos.y + curY);
                                                dirty.push([ pos.x - curX, pos.y + curY ]);
                                        }
                                }
                                if(curY > 0) {
                                        if(App.World.map.setGrid(pos.x + curX, pos.y - curY, TILES.CLEAR, TILES.CLEAR, TILES.BLOCK)) {
                                                callback(pos.x + curX, pos.y - curY);
                                                dirty.push([ pos.x + curX, pos.y - curY ]);
                                        }
                                }
                                if(curY > 0 && curX > 0) {
                                        if(App.World.map.setGrid(pos.x - curX, pos.y - curY, TILES.CLEAR, TILES.CLEAR, TILES.BLOCK)) {
                                                callback(pos.x - curX, pos.y - curY);
                                                dirty.push([ pos.x - curX, pos.y - curY ]);
                                        }
                                }
                        }

                        this.dirtyTileCleaner(dirty);

                        if(dirty.length) {
                                App.World.map.findMapBounds();
                        }
                };

                this.dirtyTileCleaner = function(tiles) {
                        // make this more efficient (?)
                        for(var i = 0; i < tiles.length; i++) {
                                for(x = -1; x <= 1; x++) {
                                        for(y = -1; y <= 1; y++) {
                                                App.World.map.setTileData(tiles[i][0] + x, tiles[i][1] + y);
                                        }
                                }
                        }
                };
        };
        
        root.App.Objects.Tools = tools;

})(this);
