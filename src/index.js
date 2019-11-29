const express = require('express');
const path = require('path')
const http = require('http')
const socketio = require('socket.io');
const Filter = require('bad-words');

const app = new express()
const server = http.createServer(app)
const io = socketio(server);

const port = process.env.PORT || 3000

const publicDirectoryPath = path.join(__dirname,'../public')
app.use(express.static(publicDirectoryPath))


io.on('connection',(socket)=>{
    socket.emit('message',"welcome!!")

    socket.broadcast.emit('message',"a new user has joined chat");

    socket.on('sendMessage',(message,callback)=>{
        const filter = new Filter();

        if(filter.isProfane(message)){
             callback('profanity not allowed');
        }

        io.emit("message",filter.clean(message));
        callback("delivered")
    })

    socket.on('sendLocation',(coords,callback)=>{
        io.emit('message',`https://google.com/maps?q=${coords.latitude},${coords.longitude}`)

        callback();
    })

    socket.on('disconnect',()=>{
        io.emit('message',"a user has left")
    })
})

server.listen(port , ()=>{
    console.log(`the server is on the port ${port}`);
})
