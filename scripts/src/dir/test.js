/**
 * @module dir/test
 * @author Viacheslav Lotsmanov
 */

$(function domRead() {
    var aspeed = parseInt('/* @echo ANIMATION_SPEED */', 10);
    $('.main_block').animate({opacity: 0.5}, aspeed*5);
}); // domReady
