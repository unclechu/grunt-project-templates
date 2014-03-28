grunt-project-templates
=======================

Templates of new projects on grunt

Usage
=====

First initialization
--------------------

    $ npm install

Configutaion
------------

See for key "grunt" in package.json

```
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
      "buildFile": "build.js"
    }
  ],
  "jshint": {
    "development": true,
    "production": true
  }
}
```

Commands
--------

Build all (styles and scripts) for production:

    $ ./grunt

Or:

    $ ./grunt production

Development build (styles and scripts):

    $ ./grunt build

Or:

    $ ./grunt development

Development build (only styles):

    $ ./grunt build-less

Development build (only scripts):

    $ ./grunt build-js

Cleanup all builded files:

    $ ./grunt clean

Cleanup only styles builds:

    $ ./grunt clean-less

Cleanup only scripts builds:

    $ ./grunt clean-js

Cleanup initialization:

    $ ./grunt distclean

Watch for any changes (in styles and in scripts) and rebuilding:

    $ ./grunt watcher

Watch for changes in styles only and rebuilding:

    $ ./grunt watcher-less

Watch for changes in scripts only and rebuilding:

    $ ./grunt watcher-js

Preprocessing
-------------

Create file `preprocess_context.json` in scripts sources directory with context to preprocessing. See for details: https://github.com/jsoverson/grunt-preprocess

Scripts load order
------------------

1. libs
2. src

If you need to specific load order, just name your scripts with number prefixes:

1. libs/01-jquery.js
2. libs/02-jquery.mousewheel.plugin.js
3. src/01-main.js
4. src/02-header.js
5. src/03-forms.js
