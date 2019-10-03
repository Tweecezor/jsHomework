var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http,{
    cookie:true
});

var usersNames = [];
var connections = [];
var usersDataBase = [];

http.listen(3000, function(){
    console.log('listening on *:3000');
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});


app.get('/index.js', function(req, res){
    res.sendFile(__dirname + '/public/index.js');
});

io.on('connection', function(socket){
    // console.log(socket);
    connections.push(socket);
    console.log('%s user is connected',connections.length);
    // console.log('users : '+usersNames);
    // console.log(usersDataBase);

    socket.on('chat message',function(msg,time){
        console.log(`message: ${msg}`);
        io.emit('new message', {data:msg,time:time,user:socket.username});
    })
    socket.on('disconnect', function(){
        // users.splice(users.indexOf(socket.username),1);
        usersNames = usersNames.filter(function(item){
            if(item != socket.username) return true;
        })
        updateUserNames();
        // connections.splice(connections.indexOf(socket),1);
        connections = connections.filter(function(item){
            if(item!=socket) return true;
        })
        io.emit('showWhoLeave',socket.username);
        // console.log(socket.username);
        console.log('Disconected:  %s user connected',connections.length);
        // console.log(usersDataBase);
    });

    socket.on("takeHistory",function(history,name){
        for(var i=0;i<usersDataBase.length;i++){
            if(usersDataBase[i].name == name){
                usersDataBase[i].history = history;
            }
        }
    })

    socket.on('new user',function(data,user,callback){
        console.log("-------start fn new user---------");
        console.log('userDataBase before add new user')
        console.log(usersDataBase);
        if(usersDataBase.length == 0) {
            usersDataBase.push(user);
            socket.username = data;
            usersNames.push(socket.username);
            updateUserNames();
        } else{

            for(var i=0;i<usersDataBase.length;i++){
                // console.log("item forn DATABASE")
                // console.log(usersDataBase[i]);
                if(usersDataBase[i].name == user.name && usersDataBase[i].nickname == user.nickname ){
                    console.log('not first time visit');
                    console.log("welcome again")
                    console.log("-------before return fn---------");
                    callback(true);
                    socket.username = data;
                    usersNames.push(socket.username);
                    updateUserNames();
                    user = usersDataBase[i];
                    console.log(user);
                    io.emit("addHistory",user.history);
                    return true;
                } else if(usersDataBase[i].name == user.name && usersDataBase[i].nickname != user.nickname){
                    console.log('этот ник уже занят. Введите другой')
                    return
                }

            }
            // console.log('firsst time visit');
            usersDataBase.push(user);
            socket.username = data;
            usersNames.push(socket.username);
            updateUserNames();
            // console.log('DATABASE after added new user');
            // console.log(usersDataBase);

           
            console.log("-------end fn new user---------");
        }
        if(data !== ''){
            callback(true);
        } else{
            console.log('doesnt work');
        }


     
       
      
        // usersDataBase.push(user);
        // socket.username = data;
        // usersNames.push(socket.username);
        // updateUserNames();
    })

    socket.on('get all users',function(){
      updateUserNames();
    })

   
});
function updateUserNames(){
    // console.log(usersNames);
    io.emit('getUsers',usersNames,usersDataBase);
}

