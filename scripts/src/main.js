/**
 * @module main
 * @author Viacheslav Lotsmanov
 */

// isolated view scope automatically

var varname = 'check'; // isolated
alert('"varname" in "main" module: ' + typeof varname);
