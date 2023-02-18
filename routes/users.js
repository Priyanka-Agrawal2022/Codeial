const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users_controller');

router.get('/profile', usersController.profile);
router.get('/posts', usersController.posts);
router.get('/sign_up', usersController.signUp);
router.get('/sign_in', usersController.signIn);
router.post('/create', usersController.create);

module.exports = router;