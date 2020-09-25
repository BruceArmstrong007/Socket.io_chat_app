const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const app = express();

const rooms = {};

const server = http.createServer(app);

//socket.io 
const io = socketio(server);

//Static files
app.use(express.static('public'));

//allow to use url encoded parameters
app.use(express.urlencoded({extended:true}));

//template engine Middleware
app.set('view engine','ejs');

//Routes
app.get("/:room",(req,res) => {
    if(rooms[req.body.room] != null){
      return res.redirect('/');
    }
    res.render('room',{roomName:req.params.room});
  });
  
  app.post("/room",(req,res) => {
    if(rooms[req.body.room] != null){
      return res.redirect('/');
    }
    rooms[req.body.room] = { users:{}};
    res.redirect(req.body.room);
    // Send message when room created
    io.emit('room-created',req.body.room);
  });
  
  app.get("/",(req,res) => {
    res.render('home',{rooms:rooms});
  });

const PORT = 3000 || process.env.PORT;


io.on('connection',socket =>{
    console.log('New user connected');

    socket.on('new-user',(room,name) => {
        socket.join(room);
        rooms[room].users[socket.id]= name;
        socket.to(room).broadcast.emit('user-connected',name);
        console.log(name);
    });

    socket.on('chat-message',(room,msg) => {
        socket.to(room).broadcast.emit('chat-message',{message:msg,name:rooms[room].users[socket.id]});
        console.log(msg);
    });

    socket.on('disconnect', () => {
        getUserRooms(socket).forEach(room => {
            socket.to(room).broadcast.emit('user-disconnected',rooms[room].users[socket.id]);
            delete rooms[room].users[socket.id];
            const roomFull = rooms?.users;
            if (!roomFull) delete rooms[room];
            console.log('user disconnected');
        });
    
      });
  });

function getUserRooms(socket){
return Object.entries(rooms).reduce((names,[name,room])=>{
if(room.users[socket.id] != null) names.push(name);
return names;
},[]);
}

server.listen(PORT,()=>{
    console.log(`Server is up and running on Port : ${PORT}`);
});

