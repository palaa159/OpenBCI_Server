// array helper
Array.prototype.getIndexBy = function(name, value) {
    for (var i = 0; i < this.length; i++) {
        if (this[i][name] == value) {
            return i;
        }
    }
};

var init = function() {
    // highlight page
    var path = window.location.pathname;
    var currPath = path.substr(path.lastIndexOf('/') + 1, path.length);
    var sectionToAdd = $('<div>').addClass('section');
    mdList[mdList.getIndexBy('cat', category)].content.forEach(function(item) {
        if (item.filename === currPath) {
            sectionToAdd.append($('<a class="selected mainMenuItem" href="/' + category + '/' + item.filename + '">').html(item.title + '<br>'));
        } else {
            sectionToAdd.append($('<a class="notSelected mainMenuItem" href="/' + category + '/' + item.filename + '">').html(item.title + '<br>'));
        }
    });
    $('.menubar').prepend(sectionToAdd);

    //
    $('a[href="/' + category + '"]').addClass('subnavSelected');

    // reposition text
    $(window).on('flatdoc:ready', function() {
        // console.log('flatdoc ready');
        var allImgs = $('.content-img');
        $.each(allImgs, function(i, v) {
            $(v).parent().addClass('img-js');
        });
    });

    // stick nav
    var stick = false;
    $(window).on('scroll', function() {
        var amt = $(window).scrollTop();
        // console.log(amt);
        if(!stick && amt >= 100) {
            stick = true;
            // console.log('stick!');
            $('nav').addClass('stick');
            $('.content-root').addClass('pushContent');
            $('.menubar').addClass('pushMenu');
        } else if(stick && amt < 100) {
            stick = false;
            // console.log('unstick');
            $('nav').removeClass('stick');
            $('.content-root').removeClass('pushContent');
            $('.menubar').removeClass('pushMenu');
        }
    });
};

init();