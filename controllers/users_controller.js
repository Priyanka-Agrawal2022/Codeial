const User = require('../models/user');
const fs = require('fs');
const path = require('path');

// let's keep it same as before
module.exports.profile = function(req, res) {
    User.findById(req.params.id, function(err, user) {
        return res.render('user_profile', {
            title: "User Profile",
            profile_user: user
        });
    });
    // return res.end('<h1>User Profile</h1>');
}

module.exports.update = async function(req, res) {
    // if(req.user.id == req.params.id) {
    //     User.findByIdAndUpdate(req.params.id, req.body, function(err, user) {
    //         req.flash('success', 'Updated!');
    //         return res.redirect('back');
    //     });
    // }
    // else {
    //     req.flash('error', 'Unauthorized!');
    //     return res.status(401).send('Unauthorized');
    // }

    if(req.user.id == req.params.id) {
        try {
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req, res, function(err) {
                if(err) {
                    console.log('***** Multer Error: ', err);
                }

                // console.log(req.file);
                user.name = req.body.name;
                user.email = req.body.email;

                if(req.file) {
                    if(user.avatar) {
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                    }

                    // this is saving the path of the uploaded file into the avatar field in the user
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }

                user.save();    
                return res.redirect('back');
            });
        } catch(err) {
            req.flash('error', err);
            return res.redirect('back');
        }
    }
    else {
        req.flash('error', 'Unauthorized!');
        return res.status(401).send('Unauthorized');
    }
}


module.exports.posts = function(req, res) {
    // return res.end('<h1>User Posts</h1>');
    return res.render('user_posts', {
        title: "Posts"
    });
}

// render the sign up page
module.exports.signUp = function(req, res) {
    if(req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_up', {
        title: "Codeial | Sign Up"
    });
}

// render the sign in page
module.exports.signIn = function(req, res) {
    if(req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_in', {
        title: "Codeial | Sign In"
    });
}

// get the sign up data
module.exports.create = function(req, res) {
    if(req.body.password != req.body.confirm_password) {
        req.flash('error', 'Passwords do not match');
        return res.redirect('back');
    }

    User.findOne({email: req.body.email}, function(err, user) {
        if(err) {
            // console.log('error in finding user in signing up');
            req.flash('error', err);
            return;
        }

        if(!user) {
            User.create(req.body, function(err, user) {
                if(err) {
                    // console.log('error in creating user in signing up');
                    req.flash('error', err);
                    return;
                }

                return res.redirect('/users/sign-in');
            });
        }
        else {
            req.flash('success', 'You have signed up, login to continue!');
            return res.redirect('back');
        }
    });
}

// sign in and create a session for the user
module.exports.createSession = function(req, res) {
    req.flash('success', 'Logged in successfully!');
    return res.redirect('/');
}

module.exports.destroySession = function(req, res) {
    req.logout(function(err) {
        if(err) {
            // console.log('Error in signing out the user!');
            req.flash('error', err);
        }

        req.flash('success', 'You have logged out!');
        return res.redirect('/');
    });
}