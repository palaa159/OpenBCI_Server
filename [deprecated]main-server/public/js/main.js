(function() {

    var itemToHighlight = ['downloads', 'community', 'forum', 'research'];
    // Highlight the menu item of the current page
    var page = window.location.pathname;
    itemToHighlight.forEach(function(item) {
        if (page.indexOf(item) > -1) {
            // highlight
            // console.log(item);
            $('a:contains(' + item.toUpperCase() + ')').addClass('currentPosition');
        }
    });
    // Lookup hash


    // Click category
    $('span.btnCat').on('click', function() {
        if (!$(this).hasClass('label-warning')) {
            $('span.btnCat').removeClass('label-warning');
            // $(this).addClass('label-warning');
            window.location.hash = '#' + $(this).attr('name');
        }
    });

    $(window).on('hashchange', function() {
        if (window.location.pathname.indexOf('community') > -1) hashLookup();

    });

    function hashLookup() {
        var hash = window.location.hash;
        hash = hash.substr(1, hash.length);
        $('span[name^=' + hash + ']').addClass('label-warning');
        // hash -> tutorials, news, events, ...
        // also all
        $('.labelFilter').parent().parent().hide();
        if (hash === 'all') {
            $('.labelFilter').parent().parent().show();
        } else {
            $('.labelFilter_' + hash).parent().parent().show();
        }
        // retrigger masonry
        adjustMasonry();
    }

    if (window.location.pathname.indexOf('community') > -1) hashLookup();

})();