/**
 * Values for "get_val" module
 *
 * @module values
 * @author Viacheslav Lotsmanov
 * @license GNU/AGPLv3
 * @see {@link https://github.com/unclechu/web-front-end-grunt-template/blob/master/LICENSE-AGPLv3|License}
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

}); // define()
