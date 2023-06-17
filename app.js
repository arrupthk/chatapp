// o munni
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const user = require('./routes/User');
const Chats = require('./routes/chat')
const group = require('./routes/groups')
const app = express();
const sequelize = require('./database');
const cors = require('cors')
const User = require('./models/user')
const Chat= require('./models/chat')
const Usergroups = require('./models/usergroups')
const Groups = require('./models/groups')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin :"*", methods : ["GET","POST","PUT","DELETE"]}))
app.use(express.static('public'));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signUp.html'));
});
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});


app.use('/user', user);
app.use('/message', Chats);
app.use('/groups',group)

User.hasMany(Chat)
Chat.belongsTo(User)

Groups.hasMany(Chat)
Chat.belongsTo(Groups)

User.hasMany(Usergroups)
Usergroups.belongsTo(User)
  
Groups.hasMany(Usergroups)
Usergroups.belongsTo(Groups);

sequelize.sync()
  .then(() => {
    console.log('Models synchronized with the database')
  })
  .catch((error) => {
    console.error('Failed to synchronize models with the database', error);
  });
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});