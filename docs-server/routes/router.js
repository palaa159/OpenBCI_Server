/* 
	ROUTER.JS
	routing everthingy
*/

var docs = require('./docs');

module.exports = function(router, util, bodyParser, moment, github) {
    router.use(function(req, res, next) {
        console.log('-------------------------'.white);
        console.log('ROUTING STARTS'.bold);
        console.log('-------------------------'.white);
        console.log(req.method, util.inspect(req.url));
        req.url.toLowerCase();
        next();
    });

    // update .md list, kicker from GitHub Webhooks
    router.route('/update')
        .post(function(req, res, next) {
            docs.fetchDocsFromGithubJSON();
            next();
        });

    // ROUTE TO DOCS
    // /doc is removed for testing purposes
    router.route(['/',
        '/update',
        '/:cat',
        '/:cat/:id'
    ])
        .get(function(req, res) {
            docs.processRoute(req, res, github);
        });
        
    /* SITE UTILS
     */


    // 404
    router.route('*')
        .all(function(req, res) {
            res.send('404 Page.');
        });
};