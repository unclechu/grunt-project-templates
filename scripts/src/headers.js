/**
 * Headers module
 *
 * @module headers
 * @author Viacheslav Lotsmanov
 */

define(['get_local_text'], function (getLocalText) {
$(function domReady() {

    $('h1').html( getLocalText('HEADERS', 'FIRST') );

    $('h2').html( getLocalText('HEADERS', 'SECOND') );

}); // domReady
}); // define

// vim: set sw=4 ts=4 et foldmethod=marker fenc=utf-8 :
