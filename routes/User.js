const express = require('express');
const router = express.Router();
const loginC = require('../controller/User');

router.post('/signup', loginC.signup);
router.post('/login', loginC.login)

module.exports = router;