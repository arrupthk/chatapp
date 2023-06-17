const Chat = require('../models/chat');
const Groups= require('../models/groups')
const UserGroup = require('../models/usergroups')
const User = require('../models/user')
const jwt = require('jsonwebtoken');



  async function saveMessage(req, res) {
    const { message } = req.body;

    try {
      const newMessage = await Chat.create({ 
        name: req.user.name,
        message: message,
        userId: req.user.id
      });

      res.status(201).json({ success: true, message: 'Message saved successfully', details: newMessage });
    } catch (error) {
      console.error('Failed to save the chat message:', error);
      res.status(500).json({ success: false, error: 'Failed to save the chat message' });
    }
  }

  async function getMessages(req, res) {
    try {
      const { groupId } = req.query;
  
      const messages = await Chat.findAll({
        where: { groupId: groupId || null } // Filter messages by groupId or null
      });
  
      res.status(200).json({ success: true, messages });
    } catch (error) {
      console.error('Failed to retrieve the chat messages:', error);
      res.status(500).json({ success: false, error: 'Failed to retrieve the chat messages' });
    }
  }

async function createGroup(req,res) 
{
    try{
    const {name} = req.body;
    console.log(req.body, " checking group name here")
    const group = await Groups.create({groupName : name})
    const groupId = group.id
    console.log(groupId, "why printing id here")


    await UserGroup.create({
      groupName:name,
      groupId: group.id,
      userId: req.user.id,
      userName: req.user.name,
      isAdmin: true
    })

    // await UserGroup.create({
    //   groupName:name,
    //   groupId: group.id,
    //   userId: req.user.id,
    // })
    
    res.status(200).json({ groupId: group.id, message: "Group created successfully" });
    }
    catch (error) {
    console.log('Error creating group:', error);
    res.status(500).json({ error: 'Failed to create group' });
  }
}

async function getGroupList(req, res) 
{
  try {
    const groups = await UserGroup.findAll({where :{userId : req.user.id}});
    console.log(groups, "printing groups to check")
    res.status(200).json(groups);
  } catch (error) {
    console.log('Error getting group list:', error);
    res.status(500).json({ error: 'Failed to get group list' });
  }
}

module.exports={ saveMessage,getMessages,createGroup,getGroupList}