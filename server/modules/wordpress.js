// Wordpress Module

var wp = require('wordpress');

// setup wordpress
var wpClient = wp.createClient({
	url: 'http://ultracortex.com/community',
	username: 'u76663022',
	password: 'R@tB45t@rd'
});

module.exports = {
	wpClient: wpClient
};