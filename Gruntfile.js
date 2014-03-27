module.exports = function (grunt) {
    
    var pkg = grunt.file.readJSON('package.json');

    var styles = {};

    var scripts = {
        concat: {},
        preprocess: {},
        uglify_files: {},
        jshint_files: ['Gruntfile.js'],
        wrap_files: [],
    };

    var watch = {
        js: [],
        less: [],
        all: [],
    };

    var clean = [];

    pkg.grunt.styles.forEach(function (item, i) {
        // watch
        var lessWatch = [
            item.path + '/src/**/*.less',
            item.path + '/libs/**/*.less',
        ];
        Array.prototype.push.apply(watch.less, lessWatch);
        Array.prototype.push.apply(watch.all, lessWatch);

        // clean
        clean.push(item.path + '/build');

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
                item.path + '/build/processed/**/*.js'
            ],
            dest: buildFilePath,
        };

        // js hint
        scripts.jshint_files.push(item.path + '/build/processed/**/*.js');

        // watch
        var jsWatch = [
            item.path + '/libs/**/*.js',
            item.path + '/src/**/*.js',
        ];
        Array.prototype.push.apply(watch.js, jsWatch);
        Array.prototype.push.apply(watch.all, jsWatch);

        // clean
        clean.push(item.path + '/build');

        // wrap
        scripts.wrap_files.push({
            expand: true,
            cwd: item.path + '/src/',
            src: [ '**/*.js' ],
            dest: item.path + '/build/wrap/'
        });
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
                eqeqeq: false,
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
            }
        },
        'grunt-clean': {
            build: clean,
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
    grunt.registerTask('build-js', ['wrap:js', 'build-preprocess', 'build-concat']);

    // less
    var buildLess = [];
    var buildLessProduction = [];
    for (key in styles) {
        if (/^development/.test(key)) {
            buildLess.push('less:' + key);
        }
        if (/^production/.test(key)) {
            buildLessProduction.push('less:' + key);
        }
    }
    grunt.registerTask('build-less', buildLess);
    grunt.registerTask('build-less-production', buildLessProduction);

    // other
    grunt.registerTask('build', ['build-js', 'build-less']);
    grunt.registerTask('production', [
        'wrap:js',
        'build-preprocess',
        'jshint',
        'build-concat',
        'uglify:js',
        'build-less-production'
    ]);
    grunt.registerTask('default', 'production');
    grunt.registerTask('watcher-js', 'watch:js');
    grunt.registerTask('watcher-less', 'watch:less');
    grunt.registerTask('watcher', 'watch:all');
    grunt.registerTask('clean', 'grunt-clean:build');
    grunt.registerTask('distclean', 'grunt-clean:dist');

};
