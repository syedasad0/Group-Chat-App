var socket = io();

socket.on('usernameSuccess', successUsername);
socket.on('usernameFailure', failureUsername);
socket.on('messageSent', messageSent);
socket.on('receivedMessage', receivedMessage);
socket.on('showOnlineUsers', refreshOnlineUsers);

function scrollMessageBoard() {
  var scroll = document.getElementById('messageBoard');
  scroll.scrollTop = scroll.scrollHeight;
  scroll.animate({ scrollTop: scroll.scrollHeight }, { duration: 2000 });
}


function onUsernameInput() {
  let usernameInput = document.getElementById('usernameInput');
  let username = usernameInput.value;
  if (username && username.length > 2) {
    createUser(username);
  } else {
    alert("enter correct username");
  }
}

function createUser(data) {
  socket.emit('createUser', { username: data });
}

function successUsername(data) {
  let rightContainer1 = document.getElementById('rightContainer1');
  let rightContainer2 = document.getElementById('rightContainer2');
  rightContainer1.style.display = 'none';
  rightContainer2.style.display = 'block';
}

function failureUsername(data) {
  alert(data.message);
  let rightContainer1 = document.getElementById('rightContainer1');
  let rightContainer2 = document.getElementById('rightContainer2');
  if (rightContainer2.style.display == 'block') {
    rightContainer2.style.display = 'none';
    rightContainer1.style.display = 'block';
  }
}

function messageSent(data) {
  let messageInput = document.getElementById("messageInput");
  messageInput.value = '';
  let messageNode = document.createElement("LI");
  let textnode = document.createTextNode(data.message);
  messageNode.id = "message1";
  messageNode.appendChild(textnode);
  document.getElementById("messageBoard").appendChild(messageNode);
}

function sendMessage(data) {
  sendToUser();
  socket.emit("sendMessage", { message: data });
}

function onMessageSend() {
  let messageInput = document.getElementById("messageInput");
  let data = messageInput.value;
  console.log(data);
  sendMessage(data);
}

function receivedMessage(data) {

  let messageNode = document.createElement("LI");
  let textnode = document.createTextNode(data);
  messageNode.id = "message2";
  messageNode.appendChild(textnode);
  document.getElementById("messageBoard").appendChild(messageNode);
}

function checkOnlineUsers() {
  socket.emit('getOnlineUsers', "get online users list");
}

function refreshOnlineUsers(data) {
  document.getElementById("sideBoard").innerHTML = '';
  for (index = 0; index < data.users.length; index++) {
    displayOnlineUser(data.users[index]);
  }
}

function displayOnlineUser(user) {
  let userNode = document.createElement("LI");
  let textnode = document.createTextNode(user.username);
  if (user.status == 1)
    userNode.id = "onlineUser";
  else
    userNode.id = "offlineUser";
  userNode.appendChild(textnode);
  userNode.setAttribute("class", "card hoverable" );
  userNode.setAttribute("onClick", "selectUser(this)" );
  document.getElementById("sideBoard").appendChild(userNode);
}

function selectUser(selectedItem){
  // selectedItem.setAttribute("onClick", "selectUser(this)" );
  document.getElementById('selectedUser').innerHTML = selectedItem.innerHTML;
  socket.emit("JoinRoom", { roomName: selectedItem.innerHTML })
}

function sendToUser(){
  let data = document.getElementById("messageInput").value;
  console.log(data);
  let user = document.getElementById("selectedUser").innerHTML;
  console.log({ to: user, message: data });
  socket.emit('sendTo',{to:user,message:data})
}
