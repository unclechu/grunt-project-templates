/**
 * Provide "getVal" for getting values from "values" module
 *
 * @module get_val
 * @author Viacheslav Lotsmanov
 * @version 0.2
 */

define(['values'],
function (values) {

    var required = values.required;
    values = values.values;

    function getVal() {

        // delegate to "get" method
        return getVal.get.apply(this, arguments);

    }

    function checkRequired() {

        $.each(required, function (i, key) {

            if (!(key in values)) {
                throw new getVal.exceptions.RequiredIsNotSet(null, key);
            }

        });

    }

    /**
     * Only for "required" keys
     *
     * @public
     */
    getVal.set =
    function set(key, val) {

        if (typeof key !== 'string') {
            throw new getVal.exceptions.IncorrectKey(null, typeof(key));
        }

        var found = false;

        $.each(required, function(i, rKey) {

            if (rKey === key) found = true;

        });

        if (!found) {
            throw new getVal.exceptions.NotInRequiredList(null, key);
        }

        values[key] = val;

    };

    /** @public */
    getVal.get =
    function get(key, ignoreRequired) {

        if (!ignoreRequired) checkRequired();

        if (typeof key !== 'string') {
            throw new getVal.exceptions.IncorrectKey(null, typeof(key));
        }

        if (!(key in values)) {
            throw new getVal.exceptions.KeyIsNotExists(null, key);
        }

        return values[key];

    };

    /* exceptions {{{1 */

    /**
     * @static
     * @public
     */
    getVal.exceptions = {};

    getVal.exceptions.IncorrectKey =
    function IncorrectKey(message, keyType) {
        Error.call(this);
        this.name = 'IncorrectKey';
        if (message) {
            this.message = message;
        } else {
            this.message = 'Incorrect key type';
            if (key) this.message += ' ("'+ keyType +'")';
            this.message += ', must be a string';
        }
    };

    getVal.exceptions.KeyIsNotExists =
    function KeyIsNotExists(message, key) {
        Error.call(this);
        this.name = 'KeyIsNotExists';
        if (message) {
            this.message = message;
        } else {
            this.message = 'Key';
            if (key) this.message += ' "'+ key +'"';
            this.message += ' is not exists';
        }
    };

    getVal.exceptions.RequiredIsNotSet =
    function RequiredIsNotSet(message, key) {
        Error.call(this);
        this.name = 'RequiredIsNotSet';
        if (message) {
            this.message = message;
        } else {
            this.message = 'Required key is not set';
            if (key) this.message += ': "'+ key +'"';
        }
    };

    getVal.exceptions.NotInRequiredList =
    function NotInRequiredList(message, key) {
        Error.call(this);
        this.name = 'NotInRequiredList';
        if (message) {
            this.message = message;
        } else {
            this.message = 'Key';
            if (key) this.message += ' "'+ key +'"';
            this.message += ' not in the required list';
        }
    };

    for (var key in getVal.exceptions) {
        getVal.exceptions[key].prototype = Error.prototype;
    }

    /* exceptions }}}1 */

    return getVal;

}); // define

// vim: set sw=4 ts=4 et foldmethod=marker :
