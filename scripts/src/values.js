/**
 * Values for "get_val" module
 *
 * @module values
 * @author Viacheslav Lotsmanov
 */

define(function () {

    /** @public */ var exports = {};

    exports.values = {
        animationSpeed: 200,
        cookieExpires: 365
    };

    /** Required set before "getVal" */
    exports.required = [
        'lang',
        'revision'
    ];

    return exports;

}); // define

// vim: set sw=4 ts=4 et foldmethod=marker :
