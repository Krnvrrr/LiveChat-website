const express = require('express');
const router = express.Router();
const app = express();
const {Server}=require('socket.io')
const server = require('http').createServer(app);
const cors=require('cors')
app.use(cors())
const io = new Server(server,{cors:{origin:'http://localhost:3000',methods:['get','post']}})

let users=[];
let userNames=[];
const port=5000;
io.on('connection',(socket)=>{
    
    socket.on('new-user-joined',(name)=>{
      users[socket.id]=name;
      userNames.push(name);
      io.to(socket.id).emit('users',userNames );
      console.log('user by name ',name, 'joined server')
      socket.broadcast.emit('user-joined',{name,userNames})
    });
    socket.on('send', (message)=>{
        socket.broadcast.emit('recived',{message:message,name:users[socket.id]})
    });
    socket.on('disconnect',(message)=>{
        const name=users[socket.id];
        userNames=userNames.filter((element)=>{ return element!=users[socket.id]})
        socket.broadcast.emit('leave',{name,userNames}) 
        delete users[socket.id];

    });
})


server.listen(port,()=>{console.log(`connected successfully listening on port http://localhost:${port}`)})
