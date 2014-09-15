module.exports = function(grunt) {

        grunt.initConfig({
                pkg: grunt.file.readJSON('package.json'), 
                dirs: {
                        src: 'app', 
                        dest: 'build/targets/web'
                }, 
                jshint: {
                        all: [ '<%= dirs.src %>/game/**/**.js' ], 
                }, 
                concat: {
                        options: {
                                separator: ';'
                        },
                        dist: {
                                src: [ 
                                        '<%= dirs.src %>/lib/*.js', 
                                        '<%= dirs.src %>/game/*.js', 
                                        '<%= dirs.src %>/game/*/*.js', 
                                        '<%= dirs.src %>/game/*/*/*.js' 
                                ], 
                                dest: '<%= dirs.dest %>/<%= pkg.name %>.js'
                        }
                },
                fakeuglify: {
                        options: {
                                src: '<%= dirs.dest %>/<%= pkg.name %>.js', 
                                dest: '<%= dirs.dest %>/<%= pkg.name %>.min.js'
                        },
                        windows: {}
                }, 
                uglify: {
                        dist: {
                                src: '<%= dirs.dest %>/<%= pkg.name %>.js', 
                                dest: '<%= dirs.dest %>/<%= pkg.name %>.min.js'
                        }
                },
                buildjs: {
                        options: {
                                src: [ '<%= dirs.dest %>/**' ], // this is actually used for the copy source
                                dest: '<%= dirs.dest %>', 
                                jsDelete: '<%= dirs.dest %>/<%= pkg.name %>.js'
                        }, 
                        windows: {}, 
                        osx: {}, 
                        web: {}
                }, 
                precompress: {
                        windows: {}, 
                        osx: {}
                }, 
                compress: {
                        osx: {
                                options: {
                                        archive: 'build/targets/osx/app.nw', 
                                        mode: 'zip'
                                }, 
                                files: [
                                        { expand: true, cwd: 'build/targets/web/', src: [ '**' ], dest: '' }, 
                                        { expand: true, cwd: 'build/targets/osx/', src: [ 'package.json' ], dest: '' }
                                ]
                        }, 
                        windows: {
                                options: {
                                        archive: 'build/targets/windows/package.nw', 
                                        mode: 'zip'
                                }, 
                                files: [
                                        { expand: true, cwd: 'build/targets/web/', src: [ '**' ], dest: '' }, 
                                        { expand: true, cwd: 'build/targets/windows/', src: [ 'package.json' ], dest: '' }
                                ]
                        }
                }
        });

        grunt.loadNpmTasks('grunt-contrib-jshint');
        grunt.loadNpmTasks('grunt-contrib-concat');
        grunt.loadNpmTasks('grunt-contrib-uglify');
        grunt.loadNpmTasks('grunt-contrib-compress');

        // default target will build the web version
        grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'buildjs:web']);

        // task to build standalone OSX version
        grunt.registerTask('osx', 
                ['jshint', 'concat', 'uglify', 'buildjs:osx', 'precompress:osx', 'compress:osx']
        );

        // task to build standalone Windows version
        grunt.registerTask('windows', 
                ['jshint', 'concat', 'uglify', 'buildjs:windows', 'precompress:windows', 'compress:windows']
        );

        // windows debug (don't uglify scripts)
        grunt.registerTask('windowsdebug', 
                ['jshint', 'concat', 'fakeuglify:windows', 'buildjs:windows', 'precompress:windows', 'compress:windows']
        );

        grunt.registerMultiTask('fakeuglify', 'Pretend to uglify', function(){
                grunt.file.copy(this.options().src, this.options().dest);
        });

        // build common items (js/index/assets etc)
        grunt.registerMultiTask('buildjs', 'Build the web app', function(){
                
                // build the distributable index file
                var indexTpl = grunt.file.read('build/resources/common/index.tpl'), 
                    index = grunt.template.process(indexTpl), 
                    targetDir = this.options().dest;

                grunt.file.write(targetDir + '/index.html', index);

                // copy assets
                grunt.file.recurse('app/assets', function(abspath, rootdir, subdir, filename) {
                        grunt.file.copy(abspath, targetDir + '/assets/' + subdir + '/' + filename);
                });

                // delete the non-monified js
                grunt.file.delete(this.options().jsDelete);
        });

        // build package.json for node-webkit and Info.plist for OS X
        grunt.registerMultiTask('precompress', 'Build node-webkit before building the package', function(){

                var targetDir = 'build/targets/' + this.target, 
                    packageTpl = grunt.file.read('build/resources/common/nw-package.tpl'), 
                    packageJson = grunt.template.process(packageTpl), 
                    plistTpl = '', 
                    plistFile = '';

                // build/write package.json (this is common for both targets)
                grunt.file.write(targetDir + '/package.json', packageJson);

                if(this.target == 'osx') {
                        plistTpl = grunt.file.read('build/resources/osx/Info.plist.tpl');
                        plistFile = grunt.template.process(plistTpl);
                        grunt.file.write(targetDir + '/Info.plist', plistFile);
                }
        });
};
