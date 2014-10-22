module.exports = function(grunt) {

    'use strict';

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        // global variables
        globalConfig: {
            src: 'sources/',
            dest: '_dist/'
        },

        // js compression and concatenation
        uglify : {
            options : {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
                compress: {
                    sequences: true, // join consecutive statemets with the “comma operator”
                    properties: true, // optimize property access: a["foo"] → a.foo
                    dead_code: true, // discard unreachable code
                    conditionals: true, // optimize if-s and conditional expressions
                    booleans: true, // optimize boolean expressions
                    loops: true, // optimize loops
                    unused: true, // drop unused variables/functions
                    if_return: true, // optimize if-s followed by return/continue
                    join_vars: true // join var declarations
                },
                mangle: false,
                beautify: true
            },

            dist : {
                files : {
                    '<%= globalConfig.dest %>js/main.js':[
                        '<%= globalConfig.src %>scripts/Levels.js',
                        '<%= globalConfig.src %>scripts/framework/**/*.js',
                        '<%= globalConfig.src %>scripts/application/**/*.js',
                        '<%= globalConfig.src %>scripts/main.js'
                    ]
                }
            },

            plugins: {
                dest: '<%= globalConfig.dest %>js/lib/plugins.js',
                src: [
                    '<%= globalConfig.src %>scripts/plugins/qrcode.min.js',
                    '<%= globalConfig.src %>scripts/plugins/microevent.js',
                    '<%= globalConfig.src %>scripts/plugins/proton.js',
                    '<%= globalConfig.src %>scripts/plugins/hammer.min.js',
                    '<%= globalConfig.src %>scripts/plugins/pixi.js',                   
                    '<%= globalConfig.src %>scripts/plugins/modernizr-2.7.1.min.js',
                    '<%= globalConfig.src %>scripts/plugins/jquery-1.11.0.min.js',
                    '<%= globalConfig.src %>scripts/plugins/class.js',
                    '<%= globalConfig.src %>scripts/plugins/easegame/**/*.js'
                ]
            }
        },

        // css preprocessor compiler, compression and concatenation
        stylus: {
            options : {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
            },
            compile: {
                files: {
                    '<%= globalConfig.dest %>/css/main.css': ['sources/styles/main.styl']
                }
            }
        },

        jshint: {
            all: [
                    '<%= globalConfig.src %>scripts/framework/**/*.js',
                    '<%= globalConfig.src %>scripts/application/**/*.js',
                    '<%= globalConfig.src %>scripts/main.js',
                    '<%= globalConfig.src %>scripts/Levels.js'
            ],
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            }
        },

        // image compression
        imagemin: {
            options: {
                cache: false
            },

            dynamic: {
                files: [{
                    expand: true,
                    cwd: '<%= globalConfig.src %>/img/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: '<%= globalConfig.dest %>/img/'
                }]
            }
        },

        watch: {
            css: {
                files: [
                    'sources/styles/*.styl'
                ],
                tasks: ['stylus']
            },
            js: {
                files: ['<%= jshint.all %>'],
                tasks: ['jshint','uglify']
            }
        } // watch
    });

    // load plugins
    require('load-grunt-tasks')(grunt);

    // tasks
    grunt.registerTask('js', [ 'jshint', 'uglify' ]);
    grunt.registerTask('css', ['stylus']);
    grunt.registerTask('default', ['js','css']);
    grunt.registerTask('w', ['default', 'watch']);
};
