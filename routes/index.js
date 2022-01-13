const express = require('express');
const router = express.Router();

const post_controller = require('../controllers/postController');

router.get('/', post_controller.index);

router.post('/register', post_controller.createUser_post);


// Log in page
router.get('/login', post_controller.login_get);

router.post('/login', post_controller.loginUser_post);


router.get('/register', post_controller.register_get);


module.exports = router;
