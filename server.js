var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http,{
    cookie:true
});

var users = [];
var connections = [];

http.listen(3000, function(){
    console.log('listening on *:3000');
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    // console.log(socket);
    connections.push(socket);
    console.log('%s user is connected',connections.length);
    console.log('users : '+users);

    socket.on('chat message',function(msg,time){
        console.log(`message: ${msg}`);
        io.emit('new message', {data:msg,time:time,user:socket.username});
    })
    socket.on('disconnect', function(){
        users.splice(users.indexOf(socket.username),1);
        updateUserNames();
        connections.splice(connections.indexOf(socket),1);
        console.log('Disconected:  %s user connected',connections.length);
    });

    socket.on('new user',function(data,callback){
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateUserNames();
    })
    socket.on('get all users',function(){
      updateUserNames();
    })

    function updateUserNames(){
        console.log(users);
        io.emit('getUsers',users);
    }
});

