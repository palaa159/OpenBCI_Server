//http://aceontech.com/howto/nodejs/2013/11/27/how-to-parse-rss-podcasts-with-nodejs.html

var FeedParser = require('feedparser'),
    http = require('http');

var fetch = function(url, cb) {
	console.log('start fetching');
    http.get('http://ultracortex.com/community/?feed=atom', function(res) {
    	// console.log(res);
        res.pipe(new FeedParser({}))
            .on('error', function(error) {
                // TODO: Tell the user we just had a melt-down
                if(error) console.log(error);
            })
            .on('readable', function() {
                var stream = this,
                    item;
                while (item = stream.read()) {
                    console.log(item);
                }
            })
            .on('end', function() {

            });
    });

    // fire cb!
    if (cb) cb();
};

module.exports = {
    fetch: fetch
};