/**
 * Main module
 *
 * @module main
 * @author Viacheslav Lotsmanov
 */

define(['get_val', 'jquery'], function (getVal, $) {
$(function domReady() {

    require.config({
        map: {
            '*': {

                /* short name aliases */

                'jquery.cookie': 'libs/jquery.cookie-1.4.0'

            }
        }
    });

    $('body').each(function () {

        var $body = $(this);

        $body.fadeOut( getVal('animationSpeed')*5 , function () {

            $('title').each(function () {

                var $title = $(this);

                // unobtrusive requirement
                require(['get_local_text'], function (getLocalText) {
                    $title.html( getLocalText('PAGE_TITLE') );
                });

            });

            // unobtrusive requirement
            if ($('h1').size() > 0 || $('h2').size() > 0) {

                // unobtrusive requirement
                require(['headers']);

            }

            // page unobtrusive modules
            if ($('html').hasClass('main_page')) {

                // unobtrusive requirement
                require(['pages/main']);

            }

            $body.fadeIn( getVal('animationSpeed')*5 );

        });

    }); // .each <body>

}); // domReady
}); // define

// vim: set sw=4 ts=4 et foldmethod=marker :
