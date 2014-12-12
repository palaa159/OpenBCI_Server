var util = require('util'),
    githubAPI = require('github'),
    _ = require('underscore'),
    filePath = 'mdlist.json',
    https = require('https'),
    branch = 'dev-class',
    fs = require('fs'),
    prefixUrl = 'https://raw.githubusercontent.com/openbci/Docs/' + branch;

var docsData = [];

var gh = new githubAPI({
    version: "3.0.0",
    // optional
    debug: false,
    protocol: "https",
    host: "api.github.com",
    timeout: 5000
});

var fetchDocsFromGithubJSON = function(cb) {
    // empty doc data array
    docsData = [{
        cat: 'hardware',
        content: []
    }, {
        cat: 'software',
        content: []
    }, {
        cat: 'headware',
        content: []
    }, {
        cat: 'tutorial',
        content: []
    }];
    // auth github
    gh.authenticate({
        type: 'oauth',
        key: '1b619f378e1cc337a7c0',
        secret: 'e581c1013177861f97c13d979272fba6f9a31a21'
    });
    // get contents
    _.each(docsData, function(item) {
        console.log('fetching ' + item.cat);
        gh.repos.getContent({
            user: "openbci",
            repo: 'Docs',
            path: '/' + item.cat,
            ref: branch
        }, function(err, res) {
            if (!err) {
                res.forEach(function(file) {
                    // item.content.push()
                    // https 
                    https.get(prefixUrl + '/' + file.path, function(res) {
                        res.on('data', function(raw) {
                            var d = raw.toString();
                            d = d.substr(d.indexOf('# ') + 2, d.indexOf('\n') - 2);
                            // console.log(d);
                            item.content.push({
                                filename: file.name.substr(0, file.name.indexOf('.md')),
                                title: d
                            });
                        });
                        res.on('end', function() {
                            console.log('data scraped');
                            item.content = _.sortBy(item.content, function(o) {
                                return o.filename;
                            });
                            // fs.writeFile(filePath, JSON.stringify(docsData), function(err) {
                            //     if (!err) {
                            //         console.log('It\'s saved!');
                            //     }
                            // });
                        });
                    });
                });
            }
        });
    });
    // shitty callback
    setTimeout(function() {
        // exec callback
        if (_.isFunction(cb)) cb();
    }, 3000);
};

var processRoute = function(req, res) {
    var params = req.params;
    console.log(req.url);
    console.log('cat: ' + params.cat);
    console.log('id: ' + params.id);
    // if (req.url === '/') {
    //     res.redirect('/hardware/' + docsData[0].content[0].filename);
    // }
    var catIndex = docsData.getIndexBy('cat', params.cat);
    console.log(catIndex);
    if (!_.isUndefined(catIndex) && _.findWhere(docsData[catIndex].content, {
        filename: params.id
    })) {
        console.log('ever here?');
        renderDocs(res, docsData[catIndex].cat, params.id, docsData[catIndex].content[docsData[catIndex].content.getIndexBy('filename', params.id)].title);
    } else if(!_.isUndefined(catIndex) && _.isUndefined(params.id)) {
        res.redirect('/' + docsData[catIndex].cat + '/' + docsData[catIndex].content[0].filename);
    }else {
        // to the default page
        res.redirect('/' + docsData[0].cat + '/' + docsData[0].content[0].filename);
    }
};

var renderDocs = function(res, cat, id, title) {
    res.render('clients/docs', {
        title: title + ' | OpenBCI Documentation',
        mdList: JSON.stringify(docsData),
        prefixUrl: prefixUrl,
        branch: branch,
        category: cat,
        mdUrl: cat + '/' + id + '.md'
    });
};

// if docsData is empty
if (docsData.length == 0) {
    fetchDocsFromGithubJSON();
}

module.exports = {
    docsData: docsData,
    fetchDocsFromGithubJSON: fetchDocsFromGithubJSON,
    processRoute: processRoute
};

// array helper
Array.prototype.getIndexBy = function(name, value) {
    for (var i = 0; i < this.length; i++) {
        if (this[i][name] == value) {
            return i;
        }
    }
};