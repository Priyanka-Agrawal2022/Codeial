module.exports.profile = function(req, res) {
    // return res.end('<h1>User Profile</h1>');
    return res.render('user_profile', {
        title: "User Profile"
    });
}

module.exports.posts = function(req, res) {
    // return res.end('<h1>User Posts</h1>');
    return res.render('user_posts', {
        title: "Posts"
    });
}