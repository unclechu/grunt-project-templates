grunt-project-templates
=======================

Templates of new projects with grunt

Usage
=====

Deployment
----------

```bash
$ ./deploy.sh
```

Configutaion
------------

See for key "grunt" in package.json

```json
"grunt": {
  "styles": [
    {
      "path": "styles",
      "files": { "build.css": "main.less" }
    }
  ],
  "scripts": [
    {
      "path": "scripts",
      "buildFile": "build.js",
      "notAmdFiles": [ "*require*.js" ],
      "amd": true
    }
  ],
  "jshint": {
    "development": true,
    "production": true
  }
}
```

"amd" flag for AMD style of js-modules ([RequireJS](http://requirejs.org/))

Commands
--------

Build all (styles and scripts) for production:

```bash
$ ./grunt
```

Or:

```bash
$ ./grunt production
```

Development build (styles and scripts):

```bash
$ ./grunt build
```

Or:

```bash
$ ./grunt development
```

Development build (only styles):

```bash
$ ./grunt build-less
```

Development build (only scripts):

```bash
$ ./grunt build-js
```

Cleanup all builded files:

```bash
$ ./grunt clean
```

Cleanup only styles builds:

```bash
$ ./grunt clean-less
```

Cleanup only scripts builds:

```bash
$ ./grunt clean-js
```

Cleanup initialization:

```bash
$ ./grunt distclean
```

Watch for any changes (in styles and in scripts) and rebuilding:

```bash
$ ./grunt watcher
```

Watch for changes in styles only and rebuilding:

```bash
$ ./grunt watcher-less
```

Watch for changes in scripts only and rebuilding:

```bash
$ ./grunt watcher-js
```

Preprocessing
-------------

Create file `preprocess_context.json` in scripts sources directory with context to preprocessing. See for details: https://github.com/jsoverson/grunt-preprocess

Scripts load order
------------------

1. libs
2. src

If you need to specific load order, just name your scripts with number prefixes:

1. libs/10-jquery.js
2. libs/20-jquery.mousewheel.plugin.js
3. src/10-main.js
4. src/20-header.js
5. src/30-forms.js

For AMD style you need only require.js at first:

1. libs/10-require.js
2. libs/jquery.js
3. libs/jquery.mousewheel.plugin.js
4. src/main.js
5. src/header.js
6. src/forms.js

Issues
======

https://github.com/unclechu/grunt-project-templates/issues

Author
======

Viacheslav Lotsmanov

License
=======

[GNU/GPLv3 by Free Software Foundation](./LICENSE)
