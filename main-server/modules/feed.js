//http://aceontech.com/howto/nodejs/2013/11/27/how-to-parse-rss-podcasts-with-nodejs.html

var FeedParser = require('feedparser'),
    http = require('http');

var fetch = function(m, url, cb) {
    console.log('––start fetching––');
    var blogs = [];
    http.get('http://ultracortex.com/community/?feed=atom&fsk=12345', function(res) {
        // console.log(res);
        res.pipe(new FeedParser({}))
            .on('error', function(error) {
                // TODO: Tell the user we just had a melt-down
                if (error) console.log(error);
            })
            .on('readable', function() {
                var stream = this,
                    item;
                while (item = stream.read()) {
                    // console.log(item);
                    var blog = {
                        title: item.title,
                        summary: processExcerpt(item.summary),
                        body: item.description,
                        thumbnail: item.image,
                        author: item.author,
                        date: item.pubDate,
                        timeAgo: m(item.pubDate).fromNow(),
                        categories: item.categories
                    };
                    blogs.push(blog);
                }
            })
            .on('end', function() {
                // fire cb!
                if (cb) cb(blogs);
            });
    });
};

module.exports = {
    fetch: fetch
};

// helper 
function processExcerpt(content) {
    var removeHTMLRegex = /(<([^>]+)>)/ig;
    var excerpt = content.replace(removeHTMLRegex, '').split(/\s+/).slice(0, 50).join(' ');
    return excerpt;
}