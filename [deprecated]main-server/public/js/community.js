// Masonry
function adjustMasonry() {
    var container = document.querySelector('#masonry_container');
    var msnry = new Masonry(container, {
        // options
        itemSelector: '.masonry_item',
        gutter: 15
    });
    console.log('Masonry reloaded');
}
$(document).ready(function() {
    $('.loader').hide();
    imagesLoaded(document.querySelector('#masonry_container'), function(instance) {
        console.log('all images are loaded');
        adjustMasonry();
    });
    var isBottom = false;

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
    window.onscroll = function(ev) {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            // you're at the bottom of the page
            if (!isBottom) {
                isBottom = true;
                console.log('scrolled to bottom');
                $('.loader').fadeIn();
                // ajax
                $.ajax({
                    url: '/community/getPartial',
                    method: 'GET',
                    data: {
                        total_posts: total_posts,
                        category: (window.location.hash).substr(1, window.location.hash.length)
                    },
                    success: function(d) {
                        
                        console.log(d.blogs);
                        total_posts += d.blogs.length;
                        // append to masonry container
                        d.blogs.forEach(function(blog) {
                            // Building template
                            var item = $('<div>').addClass('masonry_item').hide();
                            var link = $('<a>').addClass('post_link').attr({
                                href: '/community/blog/' + blog.id
                            });
                            //
                            var img_container = $('<div>').addClass('image_container');
                            var cover_img = $('<img alt="cover">').addClass('com_cover_image').attr({
                                src: blog.thumbnail
                            });
                            var author = $('<span>').addClass('label').addClass('label-default').html(blog.author);
                            //
                            var post_title = $('<h3>').html(blog.title);
                            var summary = $('<p>').html(blog.summary + '...');
                            var label_container = $('<div>').addClass('label_container');
                            var breakLine = $('<br>');
                            var time = $('<span>').addClass('label').addClass('label-info').html(blog.timeAgo);
                            var spanIn = $('<span>').html(' in ');
                            // 
                            img_container.append(cover_img);
                            img_container.append(author);
                            link.append(img_container);
                            label_container.append(time);
                            label_container.append(spanIn);

                            // category
                            blog.categories.forEach(function(cat) {
                                label_container
                                    .append($('<span class="label-cat">')
                                        .addClass('label')
                                        .addClass('label-success')
                                        .addClass('labelFilter')
                                        .addClass('labelFilter_' + cat)
                                        .html(cat));
                            });
                            item.append(link);
                            item.append(post_title);
                            item.append(summary);
                            item.append(label_container);
                            //
                            // Finally
                            item.appendTo($('#masonry_container'));
                            $('.loader').hide();
                        });
                        // re-adjust masonry
                        imagesLoaded(document.querySelector('#masonry_container'), function(instance) {
                            console.log('all images are loaded');
                            // $('.masonry_item').fadeIn();

                            hashLookup();
                        });
                        // apply category/author filter
                    }
                });
            }
        } else {
            isBottom = false;
        }
    };
});