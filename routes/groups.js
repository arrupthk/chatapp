const express = require('express');
const router = express.Router();
const groupC = require('../controller/groups')
const userAuth = require('../middleware/authorisation')
router.get('/userlist', userAuth.authenticate,groupC.getUserlist)
router.post('/adduser',userAuth.authenticate,groupC.AddtoGroup)
router.get('/:groupId/groupChat',userAuth.authenticate,groupC.getMessages)
router.post('/:groupId/groupChat',userAuth.authenticate,groupC.saveMessage)
router.post('/groupId/upload',userAuth.authenticate,groupC.addFiles)
router.get('/:groupId/groupMembers', userAuth.authenticate,groupC.getMembers)
router.get('/:groupId/checkAdmin', userAuth.authenticate,groupC.getAdmin)
router.put('/:groupId/makeAdmin', userAuth.authenticate,groupC.makeUserAdmin)
router.post('/:groupId/removeUser',userAuth.authenticate,groupC.removeUser)

module.exports = router;
