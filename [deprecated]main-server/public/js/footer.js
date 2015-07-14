$(window).bind("load", function() {
    footerAdjust();
});
$(window).resize(function() {
    //footerAdjust();
});
$(document).ready(function() {
    $('#search-field').on('shown.bs.collapse', function() {
        $('.gsc-input').focus();
    });
});

////////////////////////////////

function footerAdjust() {
    var prev = $('footer').prev();

    var footerHeight = $('footer').outerHeight();
    var footerMargin = $('footer').css('marginTop').replace(/[^-\d\.]/g, '');
    var headerHeight = $('header').outerHeight();
    var pageHeight = $(document).height();

    var footerOffset = $('footer').offset();
    var prevOffset = prev.offset();
    var prevHeight = prev[0].scrollHeight;


    if (footerOffset.top < (pageHeight - footerHeight - footerMargin)) {
        console.log('Page height: ' + pageHeight);
        console.log('Footer height: ' + footerHeight);
        console.log('Header height: ' + headerHeight);
        prev.css({
            minHeight: pageHeight - headerHeight - footerHeight - footerMargin
        });
    }
}