var moment = require('moment'),
    util = require('util');
var FeedParser = require('feedparser'),
    http = require('http');

module.exports = {
    fetchAllBlogs: function(cb) {
        var url = 'http://ultracortex.com/community/?feed=atom&fsk=12345';
        console.log('––start fetching––');
        var blogs = [];
        http.get(url, function(res) {
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
                            id: processId(item.guid),
                            title: item.title,
                            summary: processExcerpt(item.summary),
                            // body: processBody(item.description),
                            body: processBody(item.description),
                            thumbnail: processThumbnail(item.description),
                            author: item.author,
                            date: item.pubDate,
                            timeAgo: moment(item.pubDate).fromNow(),
                            categories: item.categories
                        };
                        blogs.push(blog);
                    }
                })
                .on('end', function() {
                    // fire cb!
                    // console.log(blogs);
                    if (cb) {
                        cb(blogs);
                    }
                });
        });
    }
};

// helper 
function processId(guid) {
    return guid.substr(guid.indexOf('?p=') + 3, guid.length);
}

function processExcerpt(content) {
    var removeHTMLRegex = /(<([^>]+)>)/ig;
    var excerpt = content.replace(removeHTMLRegex, '').split(/\s+/).slice(0, 15).join(' ');
    return excerpt;
}

function processThumbnail(content) {
    // var re = new RegEx('<img\b[^>]+?src\s*=\s*['"]?([^\s'"?#>]+)(?<!/)');
    var url = 'http://ultracortex.com/community/wp-content/uploads';
    var prefixURLIndex = content.indexOf(url);
    var imgTypeIndex = content.regexIndexOf(/(?=.png)|(?=.jpg)|(?=.gif)/, 0);
    // console.log(prefixURLIndex, imgTypeIndex);
    var imgUrl = content.substr(prefixURLIndex, imgTypeIndex - 43);
    if (imgUrl.length > 10) {
        return imgUrl;
    } else {
        return 'img/kitten.jpg';
    }
}

function processBody(content) {
    var url = 'http://ultracortex.com/community/wp-content/uploads';
    var prefixURLIndex = content.indexOf(url);
    var imgTypeIndex = content.regexIndexOf(/(?=.png)|(?=.jpg)|(?=.gif)/, 0);
    // console.log(prefixURLIndex, imgTypeIndex);
    var imgUrl = content.substr(prefixURLIndex, imgTypeIndex - 43);
    if (imgUrl.length > 10) {
        return '<div>' + content.substr(content.indexOf('/>') + 2, content.length);
    } else {
        return content;
    }
}

String.prototype.regexIndexOf = function(regex, startpos) {
    var indexOf = this.substring(startpos || 0).search(regex);
    return (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf;
};