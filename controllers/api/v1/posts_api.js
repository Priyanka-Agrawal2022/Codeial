const Post = require('../../../models/post');
const Comment = require('../../../models/comment');

module.exports.index = async function(req, res) {
    let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            }
        });

    return res.status(200).json({
        message: "List of posts",
        posts: posts
    });
}

module.exports.destroy = async function(req, res) {
    try {
        let post = await Post.findById(req.params.id);

        // .id means converting the object id into string
        // if(post.user == req.user.id) {
            post.remove();
    
            await Comment.deleteMany({post: req.params.id});

            // if(req.xhr) {
            //     return res.status(200).json({
            //         data: {
            //             post_id: req.params.id
            //         },
            //         message: "Post deleted!"
            //     });
            // }

            // req.flash('success', 'Post and associated comments deleted!');

            // return res.redirect('back');
            return res.status(200).json({
                message: "Post and associated comments deleted!"
            });
        // }
        // else {
        //     req.flash('error', 'You cannot delete this post!');
        //     return res.redirect('back');
        // }
    } catch (err) {
        console.log('*****Error', err);
        // req.flash('error', err); 
        // return res.redirect('back');

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}