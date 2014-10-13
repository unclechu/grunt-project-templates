/**
 * Headers module
 *
 * @module headers
 * @author Viacheslav Lotsmanov
 * @license GNU/AGPLv3
 * @see {@link https://github.com/unclechu/web-front-end-grunt-template/blob/master/LICENSE-AGPLv3|License}
 */

define(['get_local_text'], function (getLocalText) {
$(function domReady() {

	$('h1').html( getLocalText('HEADERS', 'FIRST') );

	$('h2').html( getLocalText('HEADERS', 'SECOND') );

}); // domReady()
}); // define()
