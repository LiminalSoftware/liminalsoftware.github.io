module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            main: {
                src: [
                    'js/*.js',
                    'js/<%= pkg.name %>.js'
                ],
                dest: 'dist/js/<%= pkg.name %>.js',
            }
        },
        uglify: {
            main: {
                src: 'dist/js/<%= pkg.name %>.js',
                dest: 'dist/js/<%= pkg.name %>.min.js'
            }
        },
        copy: {
            main: {
                src: ['*.html', 'mail/**', 'img/**', 'less/**'],
                dest: 'dist/',
            },
            jquery: {
                files: [{
                    expand: true,
                    cwd: 'bower_components/jquery/dist/',
                    src: [
                        'jquery.js',
                        'jquery.min.js'
                    ],
                    dest: 'dist/js/'
                }, ]
            },
        },
        less: {
            expanded: {
                options: {
                    paths: ["css"]
                },
                files: {
                    "dist/css/<%= pkg.name %>.css": "less/*.less"
                }
            },
            minified: {
                options: {
                    paths: ["css"],
                    cleancss: true
                },
                files: {
                    "dist/css/<%= pkg.name %>.min.css": "less/*.less"
                }
            }
        },
        banner: '/*!\n' +
            ' * <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
            ' * Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
            ' * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n' +
            ' */\n',
        usebanner: {
            dist: {
                options: {
                    position: 'top',
                    banner: '<%= banner %>'
                },
                files: {
                    src: ['dist/css/<%= pkg.name %>.css', 'dist/css/<%= pkg.name %>.min.css', 'dist/js/<%= pkg.name %>.js', 'dist/js/<%= pkg.name %>.min.js']
                }
            }
        },
        watch: {
            scripts: {
                files: ['js/<%= pkg.name %>.js'],
                tasks: ['concat', 'uglify'],
                options: {
                    spawn: false,
                },
            },
            copy: {
                files: ['*.html', 'mail/**', 'img/**', 'less/**'],
                tasks: ['copy'],
                options: {
                    spawn: false,
                }
            },
            less: {
                files: ['less/*.less'],
                tasks: ['less'],
                options: {
                    spawn: false,
                }
            },
        }
    });

    // Load the plugins.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-banner');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task(s).
    grunt.registerTask('default', ['concat', 'uglify', 'copy', 'less', 'usebanner']);

};
