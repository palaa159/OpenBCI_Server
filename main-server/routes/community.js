// Module for managing community page

// requires
var moment = require('moment'),
    feed = require('../modules/feed'),
    util = require('util');

var fetchRSS = function() {
    var url = 'http://ultracortex.com/community/?feed=atom';
    feed.fetch(url);
};

module.exports = {
    fetchRSS: fetchRSS
};

// Helper
function processExcerpt(content) {
    var removeHTMLRegex = /(<([^>]+)>)/ig;
    var excerpt = content.replace(removeHTMLRegex, '').split(/\s+/).slice(0, 50).join(' ');
    return excerpt;
}

function processPosts(posts) {
    var toReturn = [];
    posts.forEach(function(post) {
        toReturn.push({
            id: post.id,
            title: post.title,
            timeAgo: moment(post.date).fromNow(),
            coverImage: post.thumbnail.thumbnail,
            excerpt: processExcerpt(post.content)
        });
    });
    return toReturn;
}