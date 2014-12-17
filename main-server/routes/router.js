/* 
	ROUTER.JS
	routing everthingy
*/
var community = require('./community');

module.exports = function(router, util, bodyParser, moment, github) {
    router.use(function(req, res, next) {
        console.log('-------------------------'.white);
        console.log('ROUTING STARTS'.bold);
        console.log('-------------------------'.white);
        console.log(req.method, util.inspect(req.url));
        req.url.toLowerCase();
        next();
    });

    // ROUTE TO COMMUNITY
    router.route('/community')
        .get(function(req, res) {
            community.fetchRSS();
        });

    // ROUTE TO COMMUNITY BLOG
    router.route('/community/:id')
        .get(function(req, res) {
            // console.log(req.params);
            var idToQuery = req.params.id;
            community.wpGetPostFromId(idToQuery, function(post) {
                res.render('clients/wp-post', {
                    title: post.title,
                    post: post,
                    timeAgo: moment(post.date).fromNow()
                });
            });
        });

    /* SITE UTILS
     */

    // 404
    router.route('*')
        .all(function(req, res) {
            res.send('404 Page.');
        });
};