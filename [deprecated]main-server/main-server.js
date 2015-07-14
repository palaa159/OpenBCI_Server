/* this node app will hopefully route:
	1. Docs (based on GitHub and Flatdoc)
	2. Community (based on wordpress)
	and potentially...
	the whole site
*/

var http = require('http'),
    path = require('path'),
    util = require('util'),
    express = require('express'),
    fs = require('fs'),
    colors = require('colors'),
    _ = require('underscore'),
    m = require('moment'),
    bodyParser = require('body-parser'),
    schedule = require('node-schedule'),
    storage = require('./modules/storage'),
    job = require('./modules/scheduler');

// end of dependencies

/*
	Express configs
*/

var app = express(),
    port = 3000;
app.locals.title = 'OpenBCI';

app.use(express.static(path.join(__dirname, 'public')));
app.set('port', process.env.PORT || port);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({
    extended: true
}));

/*
	Routing configs
*/
var router = express.Router();
require('./routes/router.js')(router, util, bodyParser);
app.use('/', router);

/*
    Wordpress Scraping Schedule (10mins)
*/

job.fetchAllBlogs(function(d) {
    storage.wordpress.storePosts(d);
    console.log('blogs scraped'.white);
});
var j = schedule.scheduleJob('0,10 * * * *', function() {
    job.fetchAllBlogs(function(d) {
        storage.wordpress.storePosts(d);
        console.log('blogs scraped'.white);
    });
});

/*
	init server
*/
http.createServer(app).listen(app.get('port'), function() {
    console.log();
    console.log('  OpenBCI Server Running  '.white.inverse);
    var listeningString = '  Listening on port ' + app.get('port') + "  ";
    console.log(listeningString.cyan.inverse);
});