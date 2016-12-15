// Github.js
var GitHubApi = require('github'),
    fs = require('fs'),
    filePath = 'mdlist.json',
    _ = require('underscore'),
    https = require('https'),
    prefixUrl = 'https://raw.githubusercontent.com/openbci/Docs/master/',
    MDLIST = [];

var gh = new GitHubApi({
    version: "3.0.0",
    // optional
    debug: false,
    protocol: "https",
    host: "api.github.com",
    timeout: 5000
});

var fetch = function(cb) {
    MDLIST = [];
    // delete filePath
    // fs.unlinkSync(filePath);
    console.log('trying!');
    gh.authenticate({
        type: 'oauth',
        key: '1b619f378e1cc337a7c0',
        secret: 'e581c1013177861f97c13d979272fba6f9a31a21'
    });
    console.log('Post authentication!');
    gh.repos.getContent({
        // optional:
        user: "openbci",
        repo: 'Docs',
        path: ''
    }, function(err, res) {
        if (err) throw err;
        console.log('Getting Content!');
        // console.log(res); // array
        // console.log(res.n);
        // var allMDs = _.contains(res, )
        res.forEach(function(item) {
            if (item.name.indexOf('.md') > -1 && item.name !== 'README.md') {
                // Parse MD
                // Get first line
                https.get(prefixUrl + item.name, function(res) {
                    // match first line
                    res.on('data', function(raw) {
                        var d = raw.toString();
                        d = d.substr(d.indexOf('# ') + 2, d.indexOf('\n') - 2);
                        // console.log(d);
                        MDLIST.push({
                            filename: item.name.substr(0, item.name.indexOf('.md')),
                            title: d
                        });
                    });
                    res.on('end', function() {
                        console.log('data scraped!');
                        MDLIST = _.sortBy(MDLIST, function(o) {
                            return o.filename;
                        });
                        fs.writeFile(filePath, JSON.stringify(MDLIST), function(err) {
                            if (err) throw err;
                            console.log('It\'s saved!');
                            // console.log(MDLIST);
                            cb();
                        });
                    });
                });
            }
        });
    });
};

module.exports = {
    fetch: fetch,
    prefixUrl: prefixUrl
    // MDLIST: MDLIST
};