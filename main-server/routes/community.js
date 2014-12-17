// Module for managing community page

// requires
var rss = require('rss'),
    moment = require('moment'),
    wp = require('../modules/wordpress'),
    util = require('util');

var fetchRSS = function() {

};

var wpGetPosts = function(cb) {
    wp.wpClient.getPosts(['id', 'date', 'title', 'content'], function(error, posts) {
        // console.log(posts.length);
        processed_posts = processPosts(posts);
        cb(processed_posts);
    });
};

var wpGetPostFromId = function(id, cb) {
    wp.wpClient.getPost(id, function(error, post) {
        cb(post);
    });
};

var updateRSS = function() {

};

module.exports = {
    fetchRSS: fetchRSS,
    wpGetPosts: wpGetPosts,
    wpGetPostFromId: wpGetPostFromId,
    updateRSS: updateRSS
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