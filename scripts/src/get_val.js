/**
 * GetVal module wrapper
 *
 * @module get_val
 * @author Viacheslav Lotsmanov
 * @license GNU/AGPLv3
 * @see {@link https://github.com/unclechu/web-front-end-grunt-template/blob/master/LICENSE-AGPLv3|License}
 */

define(['libs/get_val', 'values'],
function (GetVal, values) {
	var getVal = new GetVal(values);
	return getVal;
});
