module.exports = function (grunt) {
    
    var pkg = grunt.file.readJSON('package.json');

    var styles = {};

    var scripts = {
        concat: {},
        preprocess: {},
        uglify_files: {},
        jshint_files: ['Gruntfile.js'],
        wrap_files: [],
        amdwrap_libs_files: [],
        amdwrap_src_files: [],
    };

    var watch = {
        js: [],
        less: [],
        all: [],
    };

    var cleanJS = [];
    var cleanLess = [];

    pkg.grunt.styles.forEach(function (item, i) {
        // watch
        var lessWatch = [
            item.path + '/src/**/*.less',
            item.path + '/libs/**/*.less',
        ];
        Array.prototype.push.apply(watch.less, lessWatch);
        Array.prototype.push.apply(watch.all, lessWatch);

        // clean
        cleanLess.push(item.path + '/build');

        // less compile
        var lessFiles = {};
        for (var key in item.files) {
            lessFiles[item.path +'/build/'+ key] = item.path +'/src/'+ item.files[key];
        }
        styles['development_'+i] = {
            options: {
                paths: [
                    item.path + '/libs',
                    item.path + '/src',
                ],
            },
            files: lessFiles,
        };
        styles['production_'+i] = {
            options: {
                paths: [
                    item.path + '/libs',
                    item.path + '/src',
                ],
                compress: true,
            },
            files: lessFiles,
        };
    });

    pkg.grunt.scripts.forEach(function (item, i) {
        // minification
        var buildFilePath = item.path +'/build/'+ item.buildFile;
        scripts.uglify_files[buildFilePath] = buildFilePath;

        // preprocess variables
        var context;
        var variablesPath = item.path +'/src/preprocess_context.json';
        try { context = grunt.file.readJSON(variablesPath); } catch (err) { context = {}; }
        scripts.preprocess['js_'+i] = {
            options: { context: context },
            files: [{
                expand: true,
                cwd: item.path + '/build/wrap/',
                src: [ '**/*.js' ],
                dest: item.path + '/build/processed/',
            }],
        };

        // concat
        scripts.concat['js_'+i] = {
            options: { separator: '\n;\n' },
            src: [
                item.path + '/libs/**/*.js',
                item.path + '/build/processed/**/*.js',
            ],
            dest: buildFilePath,
        };

        // js hint
        scripts.jshint_files.push(item.path + '/build/processed/**/*.js');
        if (item.amd) {
            // ignore libs
            scripts.jshint_files.push('!' + item.path + '/build/processed/libs/**/*.js');
        }

        // watch
        var jsWatch = [
            item.path + '/libs/**/*.js',
            item.path + '/src/**/*.js',
        ];
        Array.prototype.push.apply(watch.js, jsWatch);
        Array.prototype.push.apply(watch.all, jsWatch);

        // clean
        cleanJS.push(item.path + '/build');

        // wrap
        if (item.amd) {
            scripts.amdwrap_libs_files.push({
                expand: true,
                cwd: item.path + '/libs/',
                src: [ '**/*.js' ],
                dest: item.path + '/build/wrap/libs/',
            });
            scripts.amdwrap_src_files.push({
                expand: true,
                cwd: item.path + '/src/',
                src: [ '**/*.js' ],
                dest: item.path + '/build/wrap/',
            });
        } else {
            scripts.wrap_files.push({
                expand: true,
                cwd: item.path + '/src/',
                src: [ '**/*.js' ],
                dest: item.path + '/build/wrap/',
            });
        }
    });

    grunt.initConfig({
        configs: pkg.grunt,
        concat: scripts.concat,
        uglify: {
            js: {
                options: { preserveComments: 'some' },
                files: scripts.uglify_files,
            },
        },
        preprocess: scripts.preprocess,
        jshint: {
            options: {
                browser: true,
                jquery: true,
            },
            all: scripts.jshint_files,
        },
        watch: {
            js: {
                files: watch.js,
                tasks: [ 'build-js' ],
            },
            less: {
                files: watch.less,
                tasks: [ 'build-less' ],
            },
            all: {
                files: watch.all,
                tasks: [ 'build' ],
            },
        },
        less: styles,
        wrap: {
            js: {
                options: {
                    wrapper: ['\n;(function () {\n', '\n})();\n'],
                },
                files: scripts.wrap_files,
            },
        },
        amdwrap: {
            libs: {
                options: { dir: 'libs' },
                files: scripts.amdwrap_libs_files,
            },
            src: {
                files: scripts.amdwrap_src_files,
            },
        },
        'grunt-clean': {
            js: cleanJS,
            less: cleanLess,
            dist: [
                'grunt',
                'start-http-server',
                'node_modules',
            ],
        },
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-preprocess');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-wrap');
    grunt.loadNpmTasks('grunt-amdwrap');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.task.renameTask('clean', 'grunt-clean');

    var key;

    // concat
    var buildConcat = [];
    for (key in scripts.concat) {
        buildConcat.push('concat:' + key);
    }
    grunt.registerTask('build-concat', buildConcat);

    // preprocess
    var buildPreprocess = [];
    for (key in scripts.preprocess) {
        buildPreprocess.push('preprocess:' + key);
    }
    grunt.registerTask('build-preprocess', buildPreprocess);

    var buildJS = [
        'clean-js',
        'wrap:js', 'amdwrap:libs', 'amdwrap:src',
        'build-preprocess',
    ];
    var buildJSPart2 = [
        'build-concat',
    ];
    if (pkg.grunt.jshint.development) {
        buildJS.push('jshint');
    }
    buildJS = buildJS.concat(buildJSPart2);

    var buildJSProduction = [
        'clean-js',
        'wrap:js', 'amdwrap:libs', 'amdwrap:src',
        'build-preprocess',
    ];
    var buildJSProductionPart2 = [
        'build-concat',
        'uglify:js',
    ];
    if (pkg.grunt.jshint.production) {
        buildJSProduction.push('jshint');
    }
    buildJSProduction = buildJSProduction.concat(buildJSProductionPart2);

    // less
    var buildLess = ['clean-less'];
    var buildLessProduction = ['clean-less'];
    for (key in styles) {
        if (/^development/.test(key)) {
            buildLess.push('less:' + key);
        }
        if (/^production/.test(key)) {
            buildLessProduction.push('less:' + key);
        }
    }

    grunt.registerTask('build-js', buildJS);
    grunt.registerTask('build-js-production', buildJSProduction);
    grunt.registerTask('build-less', buildLess);
    grunt.registerTask('build-less-production', buildLessProduction);
    grunt.registerTask('build', ['build-js', 'build-less']);
    grunt.registerTask('watcher-js', ['watch:js']);
    grunt.registerTask('watcher-less', ['watch:less']);
    grunt.registerTask('watcher', ['watch:all']);
    grunt.registerTask('clean', ['grunt-clean:js', 'grunt-clean:less']);
    grunt.registerTask('clean-js', ['grunt-clean:js']);
    grunt.registerTask('clean-less', ['grunt-clean:less']);
    grunt.registerTask('distclean', ['grunt-clean:dist']);
    grunt.registerTask('development', ['build']);
    grunt.registerTask('production', [
        'build-js-production',
        'build-less-production',
    ]);
    grunt.registerTask('default', ['production']);

};
