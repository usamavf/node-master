const express = require('express');
const Auth = require('../controllers/auth');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', Auth.register);

router.post('/login', Auth.login);

router.get('/me', protect, Auth.getMe);

module.exports = router;