// Module for managing community page

// requires
var moment = require('moment'),
    feed = require('../modules/feed'),
    util = require('util');

var fetchRSS = function(cb) {
    var url = 'http://ultracortex.com/community/?feed=atom&fsk=12345';
    feed.fetch(moment, url, cb);
};

module.exports = {
    fetchRSS: fetchRSS
};

// Helper