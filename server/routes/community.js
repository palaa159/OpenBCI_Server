// Module for managing community page

// requires
var rss = require('rss'),
	wp = require('../modules/wordpress'),
	util = require('util');

var fetchRSS = function() {

};

var wpGetPosts = function(cb) {
	wp.wpClient.getPosts(function(error, posts) {
		cb(posts);
	});
};

var updateRSS = function() {

};

module.exports = {
	fetchRSS: fetchRSS,
	wpGetPosts: wpGetPosts,
	updateRSS: updateRSS
};