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
//console.log(id, "print real id")
//console.log(username, "my username");

async function getMessages() {
  try {
    const response = await axios.get('http://localhost:5000/message/Chats',{
      headers: { 'Authorization': token }
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

    const groupId = response.data.groupId; // Assign the value to groupId
    console.log(groupId, "why printing id idhr")

    localStorage.setItem('groupId', groupId); // Save groupId in local storage
    localStorage.setItem('groupName',groupName)
    console.log(groupName, "print group name over here")
    
    console.log(response.data.message);
    //window.location.href = "group.html";
  } catch (error) {
    console.log('Error creating group:', error);
  }
}

async function showAllGroups() { 
  try {
    const response = await axios.get('http://localhost:5000/message/group', {
            headers: { 'Authorization': token }
    });
    const groupList = document.getElementById('group-list');
    groupList.innerHTML = '';
    const groups = response.data;
    groups.forEach(group => {
      const listItem = document.createElement('li');
      const link = document.createElement('a');
      link.textContent = group.groupName;
      link.href = `group.html#${group.groupId}`; 
      listItem.appendChild(link);
      groupList.appendChild(listItem);
    });
  } catch (error) {
    console.log('Error fetching groups:', error);
  }
}

showAllGroups();

// function startPolling() {
//   setInterval(async () => {
//     await getMessages(); 
//   }, 500); 
// }