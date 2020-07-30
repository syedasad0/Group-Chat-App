'use strict';

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const socket_io = require('socket.io');
const socketIO = socket_io(server);

let rooms = [];
let clients = [];

app.use('/', express.static('public'));

app.get('/', function (req, res) {
  res.sendfile('index.html');
});

const chatSpace = socketIO;

chatSpace.on('connection', (socket) => {

  socket.on('createUser', (data) => {

    if (clients.length < 1) {
      socket.username = data.username;
      clients.push({ username: data.username, status: 1 })
      socket.emit('usernameSuccess', { message: "user created succesfully" });
    }
    else if (clients.findIndex(user => user.username == data.username) == -1) {
      socket.username = data.username;
      clients.push({ username: data.username, status: 1 })
      socket.emit('usernameSuccess', { message: "user created succesfully" });
    } else {
      let clientIndex = clients.findIndex(user => user.username == data.username)
      if (clients[clientIndex].status == 0) {
        clients[clientIndex].status = 1;
        socket.emit('usernameSuccess', { message: "welcome back user" });
      } else {
        socket.emit('usernameFailure', { message: "username already taken" });
      }
    }
  })

  socket.on('sendMessage', data => {
    //Perform DB calls
    socket.emit('messageSent', { message: data.message })
    // setTimeout(() => { socket.emit('receivedMessage', { message: "hello " + socket.username }) }, 2000)
  })

  socket.on('getOnlineUsers', (data) => {
    socket.emit('showOnlineUsers', { users: clients });
  })

  socket.on('disconnect', function () {
    if (clients.length > 0) {
      let clientIndex = clients.findIndex(user => user.username == socket.username);
      clients[clientIndex].status = 0
    }
  });




  socket.on('sendTo',(data)=>{
    console.log("SEND TO DATA",data);
    console.log("ROOMS", rooms);
    console.log("clients", clients);
    rooms.push(data.to);
    socket.join(data.to);
    socket.to(data.to).emit('receivedMessage', data.message || "asdasdASLLL");
  })

  socket.on('JoinRoom', (data) => {
    console.log(data);
    // console.log(socket.adapter.rooms);
    // Object.keys(socket.adapter.rooms).forEach((roomName)=>{
      socket.leaveAll()
    // })
    socket.join(data.roomName);
  })


});

server.listen(3003, console.log("Server listening on port 3003"));