const express = require('express');
const router = express.Router();
const chatC = require('../controller/chat');
const userAuth = require('../middleware/authorisation')

router.post('/Chats',userAuth.authenticate, chatC.saveMessage);
router.get('/Chats',userAuth.authenticate, chatC.getMessages);
router.get('/group',userAuth.authenticate,chatC.getGroupList)
router.post('/group',userAuth.authenticate, chatC.createGroup)

module.exports = router;