/* 
	ROUTER.JS
	routing everthingy
*/

var storage = require('../modules/storage.js');
var docs = require('../modules/docs.js');

module.exports = function(router, util, bodyParser, moment, github) {
    router.use(function(req, res, next) {
        console.log('-------------------------'.white);
        console.log('ROUTING STARTS'.bold);
        console.log('-------------------------'.white);
        console.log(req.method, util.inspect(req.url));
        req.url.toLowerCase();
        next();
    });

    router.route('/')
        .get(function(req, res) {
            res.render('clients/index');
        });

    router.route(['/docs',
        '/docs/update',
        '/docs/:cat',
        '/docs/:cat/:id'
    ])
        .get(function(req, res) {
            docs.processRoute(req, res, github);
        });

    router.route('/update')
        .post(function(req, res, next) {
            docs.fetchDocsFromGithubJSON();
            // next();
        });

    router.route('/downloads')
        .get(function(req, res) {
            res.render('clients/downloads');
        });

    router.route('/forum')
        .get(function(req, res) {
            res.render('clients/forum');
        });

    router.route('/research')
        .get(function(req, res) {
            res.render('clients/research');
        });
    router.route('/copyright')
        .get(function(req, res) {
            res.render('clients/copyright');
        });
    router.route('/contact')
        .get(function(req, res) {
            res.render('clients/contact');
        });

    // ROUTE TO COMMUNITY
    router.route('/community')
        .get(function(req, res) {
            // re-route to blog all
            res.redirect('/community/blog#all');
        });

    router.route('/community/blog')
        .get(function(req, res) {
            // console.log(storage);
            res.render('clients/community', {
                data: storage.wordpress.getInitial(12)
            });
            console.log('Community page rendered'.white);
        });

    // ROUTE TO COMMUNITY BLOG
    router.route('/community/getPartial')
        .get(function(req, res) {
            var fromClient = req.query;
            // console.log(fromClient);
            fromClient.total_posts = parseInt(fromClient.total_posts);
            var data = storage.wordpress.getPartial(fromClient);
            // console.log(data);
            res.json(data);
        });

    router.route('/community/blog/:id')
        .get(function(req, res) {
            // console.log(req.params);
            var idToQuery = (req.params.id).toString();
            var post = storage.wordpress.getId(idToQuery);
            // console.log(post);
            res.render('clients/wp-post', {
                title: post.title,
                data: post
            });
            console.log('Post rendered'.white);
        });

    router.route('/community/category/:id')
        .get(function(req, res) {
            // console.log(req.params);
            var idToQuery = req.params.id;
            res.render('clients/wp-post', {
                data: storage.wordpress.getId(idToQuery)
            });
            console.log('Post rendered'.white);
        });

    router.route('/community/author/:id')
        .get(function(req, res) {
            // console.log(req.params);
            var idToQuery = req.params.id;
            res.render('clients/wp-post', {
                data: storage.wordpress.getId(idToQuery)
            });
            console.log('Post rendered'.white);
        });

    /* SITE UTILS
     */

    // 404
    router.route('*')
        .all(function(req, res) {
            res.send('404 Page.');
        });
};