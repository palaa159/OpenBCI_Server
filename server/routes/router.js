/* 
	ROUTER.JS
	routing everthingy
*/

var docs = require('./docs'),
    community = require('./community');

module.exports = function(router, util, bodyParser) {
    router.use(function(req, res, next) {
        console.log('-------------------------'.white);
        console.log('ROUTING STARTS'.bold);
        console.log('-------------------------'.white);
        console.log(req.method, util.inspect(req.url));
        next();
    });

    // ROUTE TO DOCS
    router.route('/docs')
        .get(function(req, res) {
            res.render('clients/docs', {
                title: 'OpenBCI | Official Documentation'
            });
            // console.log('go to docs');
        });

    // ROUTE TO COMMUNITY
    router.route('/community')
        .get(function(req, res) {
            res.render('clients/community', {
                title: 'OpenBCI | Community'
            });
        });

    /* SITE UTILS
     */

    // update .md list, kicker from GitHub Webhooks
    router.route('/udpatemdlist')
        .get(function(req, res) {

        });

    // 404
    router.route('*')
        .all(function(req, res) {
            res.send('bs');
        });
};