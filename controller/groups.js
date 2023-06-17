const Groups = require('../models/groups');
const User = require('../models/user');
const UserGr = require('../models/usergroups');
const Chat = require('../models/chat');
const S3 = require('../services/S3');

async function getUserlist(req, res) {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.log("Could not find user list");
    res.status(400).send({ error: "Failed to get user list" });
  }
}

async function AddtoGroup(req, res) {
  try {
    const groupId = req.body.groupId;
    const userId = req.body.userId;
    const groupName = req.body.groupName;
    const userName = req.body.userName;
    console.log(req.body, "Printing body here");

    const existingUser = await UserGr.findOne({ where: { groupId: groupId, userId: userId } });
    if (existingUser) {
      return res.status(400).json({ error: 'User is already in the group' });
    }

    const group = await UserGr.create({
      groupId: groupId,
      userId: userId,
      groupName: groupName,
      userName: userName
    });
    console.log(group, "checking for group name in details")

    res.status(200).json({ message: 'User added to group successfully' });
  } catch (error) {
    console.log('Error adding user to group:', error);
    res.status(500).json({ error: 'Failed to add user to group' });
  }
}

async function saveMessage(req, res) {
  const { message, groupId } = req.body;
  
  try {
    const newMessage = await Chat.create({
      name: req.user.name,
      message: message,
      urlfile: null,
      userId: req.user.id,
      groupId: groupId
    });

    console.log(newMessage, "checking the message details here")
    res.status(201).json({ success: true, message: 'Message saved successfully', details: newMessage });
  } catch (error) {
    console.error('Failed to save the chat message:', error);
    res.status(500).json({ success: false, error: 'Failed to save the chat message' });
  }
}

async function getMessages(req, res) {
  const groupId = req.params.groupId; 
  console.log(groupId,"checking to find group id")
  try {
    const messages = await Chat.findAll({
      where: { groupId: groupId } 
    });
    res.status(200).json({success : true, messages})
  }
  catch (error) {
    console.error('Failed to retrieve the chat messages:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve the chat messages' });
  }
}

async function getAdmin(req, res) {
  const userId = req.user.id;
  const groupId = req.params.groupId
  try {
    const group = await UserGr.findAll({ where: { groupId : groupId ,userId: userId } });
    const admin = group.length > 0 ? group[0].isAdmin : null;
    console.log(admin, "printing the admin value")

    if (admin == true) {
      const isAdmin = 1;
      res.json(isAdmin);
    } else {
      res.send('The user is not an admin of this group.');
    }
  } catch (error) {
    console.log('Error fetching group details:', error);
    res.status(500).send('Error fetching group details.');
  }
}


async function getMembers(req,res)
{
  const groupId = req.params.groupId
  console.log("checking for member with the same group id", groupId)
  try
  {
    const members= await UserGr.findAll({
      where : {groupId: groupId}
    })
    //console.log('checking for members of the group', members)
    res.status(200).json(members)
    //console.log("successfully sent the members")
  }
  catch(error)
  {
    console.error('Failed to retrieve the members:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve the chat messages' });
  }
}

async function makeUserAdmin(req, res) {
  try {
    const userId = req.body.userId;
    const groupId = req.params.groupId;

    console.log(userId, groupId, 'printing user and group id');

    const admin = await UserGr.update(
      { isAdmin: true },
      { where: { groupId: groupId, userId: userId } }
    );

    res.json({
      admin,
      message: 'Congratulations! The user is now the admin.',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}


async function removeUser(req, res) 
{
  try {
    const userId = req.body.userId;
    const groupId = req.params.groupId;
    console.log(userId, groupId, 'printing user and group id');
    
    const remove = await UserGr.destroy({ where: { groupId: groupId, userId: userId } });
  
    if (remove === 0)
    {
      return res.status(404).json({
        message: 'The user was not found in the group.',
      });
    }
    
    res.json({
      message: 'The user has been deleted.',
    });
  } catch (error) 
  {
    console.log('Error while deleting user:', error);
    res.status(500).json({
      message: 'An error occurred while deleting the user.',
    });
  }
}


async function addFiles(req, res) {
  try {
    const groupId = req.body.groupId;
    const file = req.file; 
    const s3 = new S3(); 
    const fileUrl = await s3.uploadFile(file); 

    const newFile = await Chat.create({
      name: req.user.name,
      message: null,
      urlfile: fileUrl,
      userId: req.user.id,
      groupId: groupId,
    });

    res.status(201).json({ success: true, message: 'File saved successfully', details: newFile });
  } catch (error) {
    console.error('Failed to save the file:', error);
    res.status(500).json({ success: false, error: 'Failed to save the file' });
  }
}
module.exports = { getUserlist, AddtoGroup, saveMessage, getMessages, getMembers, getAdmin, makeUserAdmin, removeUser, addFiles };