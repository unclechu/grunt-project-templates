/**
 * Main page module
 *
 * @module pages/main
 * @author Viacheslav Lotsmanov
 */

define(['get_val', 'jquery', 'jquery.cookie'],
function (getVal, $) {
$(function domReady() {

    $('html.main_page .main_block').each(function () { // {{{1

        var $mainBlock = $(this);

        $('.main_block').mouseover(function () {

            $mainBlock.addClass('small_font');

        }).mouseout(function () {

            $mainBlock.removeClass('small_font');

        });

        var cookie = $.cookie('counter');

        if (parseInt(cookie, 10) != cookie) {
            cookie = 0;
        } else {
            cookie = parseInt(cookie, 10);
        }

        cookie++;
        $.cookie('counter', cookie, { path: '/', expires: getVal('cookieExpires') });
        $mainBlock.append('<div class="cookie_counter">Cookie counter: '+ cookie +'</div>');

    }); // .each .main_block }}}1

}); // domReady
}); // define

// vim: set sw=4 ts=4 et foldmethod=marker :
