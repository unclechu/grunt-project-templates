/**
 * GetLocalText module wrapper
 *
 * @module get_local_text
 * @author Viacheslav Lotsmanov
 * @license GNU/AGPLv3
 * @see {@link https://github.com/unclechu/web-front-end-grunt-template/blob/master/LICENSE-AGPLv3|License}
 */

define(['libs/get_local_text', 'localization', 'get_val'],
function (GetLocalText, localization, getVal) {
	var getLocalText = new GetLocalText(localization, getVal('lang'));
	return getLocalText;
});
