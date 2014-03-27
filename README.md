grunt-project-templates
=======================

Templates of new projects on grunt

Usage
=====

First initialization
--------------------

    $ npm install

Commands
--------

Build all (styles and scripts) for production:

    $ ./grunt

Or:

    $ ./grunt production

Development build (styles and scripts):

    $ ./grunt build

Development build (only styles):

    $ ./grunt build-less

Development build (only scripts):

    $ ./grunt build-js

Cleanup all builded files:

    $ ./grunt clean

Cleanup initialization:

    $ ./grunt distclean

Watch for any changes (in styles and in scripts) and rebuilding:

    $ ./grunt watcher

Watch for changes in styles only and rebuilding:

    $ ./grunt watcher-less

Watch for changes in scripts only and rebuilding:

    $ ./grunt watcher-js
