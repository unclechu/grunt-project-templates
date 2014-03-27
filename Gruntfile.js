module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            js: {
                options: { separator: '\n;\n' },
                src: [
                    '<%= pkg.directories.scripts %>/libs/**/*.js',
                    '<%= pkg.directories.scripts %>/processed/**/*.js'
                ],
                dest: '<%= pkg.directories.scripts %>/build/build.js',
            },
        },
        uglify: {
            js: {
                options: { preserveComments: 'some' },
                files: {
                    '<%= pkg.directories.scripts %>/build/build.js': '<%= pkg.directories.scripts %>/build/build.js',
                },
            },
        },
        preprocess: {
            options: {
                context: grunt.file.readJSON(
                    grunt.file.readJSON('package.json').directories.scripts +
                    '/src/variables.json'
                ),
            },
            js: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= pkg.directories.scripts %>/wrap/',
                        src: [ '**/*.js' ],
                        dest: '<%= pkg.directories.scripts %>/processed/',
                    },
                ],
            },
        },
        jshint: {
            options: {
                browser: true,
                jquery: true,
                eqeqeq: false,
            },
            all: [
                'Gruntfile.js',
                '<%= pkg.directories.scripts %>/processed/**/*.js'
            ],
        },
        watch: {
            js: {
                files: [
                    '<%= pkg.directories.scripts %>/src/**/*.js',
                    '<%= pkg.directories.scripts %>/src/**/*.json',
                    '<%= pkg.directories.scripts %>/libs/**/*.js',
                ],
                tasks: [ 'build-js' ],
            },
            less: {
                files: [
                    '<%= pkg.directories.styles %>/src/**/*.less',
                    '<%= pkg.directories.styles %>/libs/**/*.less',
                ],
                tasks: [ 'build-less' ],
            },
            all: {
                files: [
                    '<%= pkg.directories.scripts %>/src/**/*.js',
                    '<%= pkg.directories.scripts %>/src/**/*.json',
                    '<%= pkg.directories.scripts %>/libs/**/*.js',
                    '<%= pkg.directories.styles %>/src/**/*.less',
                    '<%= pkg.directories.styles %>/libs/**/*.less',
                ],
                tasks: [ 'build' ],
            },
        },
        less: {
            development: {
                options: {
                    paths: [
                        '<%= pkg.directories.styles %>/libs',
                        '<%= pkg.directories.styles %>/src',
                    ],
                },
                files: grunt.file.readJSON('package.json').lessFiles,
            },
            production: {
                options: {
                    paths: [
                        '<%= pkg.directories.styles %>/libs',
                        '<%= pkg.directories.styles %>/src',
                    ],
                    compress: true,
                },
                files: grunt.file.readJSON('package.json').lessFiles,
            },
        },
        wrap: {
            js: {
                options: {
                    wrapper: ['\n;(function () {\n', '\n})();\n'],
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= pkg.directories.scripts %>/src/',
                        src: [ '**/*.js' ],
                        dest: '<%= pkg.directories.scripts %>/wrap/'
                    }
                ],
            }
        },
        'grunt-clean': {
            build: [
                '<%= pkg.directories.scripts %>/wrap',
                '<%= pkg.directories.scripts %>/processed',
                '<%= pkg.directories.scripts %>/build',
                '<%= pkg.directories.styles %>/build',
            ],
            dist: [
                'grunt',
                'start-http-server',
                'node_modules'
            ],
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-preprocess');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-wrap');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.task.renameTask('clean', 'grunt-clean');

    grunt.registerTask('build-js', ['wrap:js', 'preprocess:js', 'concat:js']);
    grunt.registerTask('build-less', 'less:development');
    grunt.registerTask('build', ['build-js', 'build-less']);
    grunt.registerTask('production', [
        'wrap:js',
        'preprocess:js',
        'jshint',
        'concat:js',
        'uglify:js',
        'less:production'
    ]);
    grunt.registerTask('default', 'production');
    grunt.registerTask('watcher-js', 'watch:js');
    grunt.registerTask('watcher-less', 'watch:less');
    grunt.registerTask('watcher', 'watch:all');
    grunt.registerTask('clean', 'grunt-clean:build');
    grunt.registerTask('distclean', 'grunt-clean:dist');

};
