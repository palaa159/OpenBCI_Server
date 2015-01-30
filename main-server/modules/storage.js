var wordpress = {};

wordpress.blogs = [];
wordpress.authors = [];
wordpress.categories = [];

wordpress.getId = function(id) {
    var postToReturn = {};
    this.blogs.forEach(function(post) {
        // console.log(post.id, id);
        if (post.id == id) {
            // console.log(post);
            postToReturn = post;
        }
    });
    return postToReturn;
};
wordpress.getAll = function() {
    return {
        blogs: this.blogs,
        authors: this.authors,
        categories: this.categories
    };
};
wordpress.getInitial = function(n) {
    return {
        blogs: this.blogs.slice(0, n),
        authors: this.authors,
        categories: this.categories
    };
};

wordpress.getPartial = function(client) {
    return {
        // returning 12 more posts
        blogs: this.blogs.slice(client.total_posts, client.total_posts + 12)
    };
};

wordpress.storePosts = function(datatostore) {
    this.blogs = datatostore;
    datatostore.forEach(function(item) {
        if (wordpress.authors.indexOf(item.author) == -1) {
            wordpress.authors.push(item.author);
        }
        item.categories.forEach(function(cat) {
            if (wordpress.categories.indexOf(cat) == -1) {
                wordpress.categories.push(cat);
            }
        });
    });
};

module.exports = {
    wordpress: wordpress
};