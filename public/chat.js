const msgform = document.getElementById('messageForm');
msgform.addEventListener('submit', sendMessage);

const createGroupButton = document.getElementById('createGroup');
createGroupButton.addEventListener('click', createGroup);


window.onload = async function() {
  await getMessages();
  showAllGroups();

 // startPolling(); // Start the polling mechanism after loading messages
}

const token = localStorage.getItem('token');
const payload = token.split('.')[1];
const decodedPayload = window.atob(payload);
const decodedToken = JSON.parse(decodedPayload);

const username = decodedToken.name
const id = decodedToken.userId

async function getMessages() {
  try {
    const response = await axios.get('http://localhost:5000/message/Chats',{
      headers: { 'Authorization': token },
      params: { groupId: null } 

    });

    const details = response.data.messages;
    const chatList = document.getElementById('chats');
    chatList.innerHTML = '';
    details.forEach(element => {
      showOnScreen(element);
    });
  } catch (err) {
    console.log(err);
  }
}

function showOnScreen(details) {
  const chatList = document.getElementById('chats');
  const chatItem = document.createElement('li');
  chatItem.textContent = `${details.name}: ${details.message}`;
  chatList.appendChild(chatItem);
}

async function sendMessage(event) {
  event.preventDefault();
  const details = {
    name : username,
    message: document.getElementById('message').value,
    userId: id
  };
  try {
    const response = await axios.post('http://localhost:5000/message/Chats', details, {
      headers: { 'Authorization': token }
    });
    console.log("Message data sent to the server:", response.data.details);

    showOnScreen(response.data.details);
    msgform.reset();
  } catch (error) {
    console.log("Error in sending message", error);
  }
}

async function createGroup(event) {
  event.preventDefault();
  const groupName = prompt('Enter group name:');

  try {
    const response = await axios.post('http://localhost:5000/message/group', { name: groupName }, {
      headers: { 'Authorization': token }
    });

    const groupId = response.data.groupId; 
    console.log(groupId, "printing group id")
    
    console.log(response.data.message);
  } catch (error) {
    console.log('Error creating group:', error);
  }
}

async function showAllGroups() {
  try {
    const response = await axios.get('http://localhost:5000/message/group', {
      headers: { 'Authorization': token }
    });
    console.log(response, "consoling response")
    const groupList = document.getElementById('group-list');
    groupList.innerHTML = '';
    

    const groups = response.data;
    console.log(groups, " consoling the groups")
    groups.forEach(group => {
      const listItem = document.createElement('li');
      const link = document.createElement('a');
      link.textContent = `${group.groupName}`;
      link.href = `group.html`
      link.setAttribute('id',group.groupId)
      listItem.appendChild(link);
      groupList.appendChild(listItem);
      
      link.addEventListener('click', function (event) {
        event.preventDefault();
        const groupName = group.groupName;
        console.log(groupName,"printing group name here")
        
        const groupId = link.getAttribute('id'); 
        console.log(groupId, "printing to check group id in seq")
        console.log(groupId," checking for the id")
        localStorage.setItem('groupId', groupId);
        localStorage.setItem('groupName', groupName)

        window.location.href = `group.html`; 
      });
    });
  } catch (error) {
    console.log('Error fetching groups:', error);
  }
}

// function startPolling() {
//   setInterval(async () => {
//     await getMessages(); 
//   }, 500); 
// }