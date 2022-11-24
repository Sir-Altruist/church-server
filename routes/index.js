const express = require('express');
const router = express.Router();
const auth = require('../controllers');
const { authentication } = require('../middleware');

router.post('/register', auth.register);
router.post('/login', auth.login);
router.get('/admin', authentication, auth.admin);

module.exports = router;
