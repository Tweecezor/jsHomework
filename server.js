var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var usersNames = [];
var connections = [];
var usersDataBase = [];
var history = [];
var currentUserNickname;

http.listen(3000, function(){
    console.log('listening on *:3000');
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/index.js', function(req, res){
    res.sendFile(__dirname + '/public/index.js');
});
app.get('/noPhoto.jpg', function(req, res){
    res.sendFile(__dirname + '/public/noPhoto.jpg');
});

io.on('connection', function(socket){
    connections.push(socket);
    console.log('%s user is connected',connections.length);

    socket.on('chat message',function(msg,time,currentUserNickname){
        console.log(`message: ${msg}`);
        history.push({data:msg,time:time,user:socket.username,nickname:currentUserNickname});
        var userImage;
        for(var i=0;i<usersDataBase.length;i++){
            if(usersDataBase[i].nickname == currentUserNickname){
                 userImage = usersDataBase[i].src;
            }
        }
        io.emit('new message', {data:msg,time:time,user:socket.username,src:userImage,nickname:currentUserNickname});
    })

    socket.on('disconnect', function(){

        io.emit('showWhoLeave',socket.username);
        console.log("disconnect nickname = " + socket.userNickname);
        // for(var i=0;i<usersDataBase.length;i++){
        //     if(usersDataBase[i].nickname == socket.userNickname){
        //         currentUserNickname = usersDataBase[i].nickname;
        //     }
        // }
        // console.log('текущий ник ' + currentUserNickname);

        usersNames = usersNames.filter(function(item){
            // console.log(`${item} = ${socket.username}`);
            // console.log(`${currentUserNickname} = ${socket.userNickname}`)
            if(item.name == socket.username && item.nickname == socket.userNickname) {
                console.log('delete')
            } else{
               console.log('оставить');
               return item;          
              }   
        })
        console.log(usersNames);

        updateUserNames();
        

        connections = connections.filter(function(item){
            if(item!=socket) return true;
        })

        console.log(`Disconected:${socket.username} ;${connections.length} user connected`,);
        
        // console.log(usersDataBase);
    });

    // socket.on("takeHistory",function(history,name){
    //     // console.log("takeHistory");
    //     // console.log(history);
    //     for(var i=0;i<usersDataBase.length;i++){
    //         if(usersDataBase[i].name == name){
    //             usersDataBase[i].history = history;
    //         }
    //     }
    //     // console.log("DATABASE after added history");
    //     // console.log(usersDataBase);
    // })

    // socket.on("takeAllHistory",function(allHistory){
    //     console.log(history);
    //    history.push(allHistory);
    //    console.log(history);
    //    count++;
    //    console.log(count);
    // })


    socket.on('uploadImageToServer',function(src,userNickname){
        for(var i=0;i<usersDataBase.length;i++){
            console.log(usersDataBase[i])
            if(usersDataBase[i].nickname == userNickname){
                usersDataBase[i].src = src;
            }
        }
        // console.log(usersDataBase);
    })

   

    socket.on('new user',function(data,user,callback){
        // console.log("-------start fn new user---------");
        // console.log('userDataBase before add new user')
        console.log(usersDataBase);
        var valide = true;
        if(usersDataBase.length == 0) {
            usersDataBase.push(user);
            socket.username = data;
            socket.userNickname = user.nickname;

            usersNames.push({
                name: socket.username,
                nickname:socket.userNickname
            });
            updateUserNames();
        } else{
            
            for(var i=0;i<usersDataBase.length;i++){
                if(usersDataBase[i].name == user.name && usersDataBase[i].nickname == user.nickname ){

                    callback(true);
                    socket.username = data;
                    // usersNames.push(socket.username);
                    socket.userNickname = user.nickname;
                    usersNames.push({
                        name: socket.username,
                        nickname:socket.userNickname
                    });
                    updateUserNames();
                    console.log(usersDataBase[i]);
                    user = usersDataBase[i];


                    io.emit("addHistory",history,usersDataBase);
                    io.emit("addAvatar",user.src,user.nickname);
                    i = usersDataBase.length;
                    valide = false;
                } else if(usersDataBase[i].name != user.name && usersDataBase[i].nickname == user.nickname){
                    console.log('этот ник уже занят. Введите другой')
                    let errorText = "этот ник уже занят. Введите другой";
                    callback(false);
                    io.emit('showErrorAuthorization',errorText);
                    i = usersDataBase.length;
                    valide = false;
                }

            }

            if(valide){
                usersDataBase.push(user);
                socket.username = data;
                socket.userNickname = user.nickname;
                // usersNames.push(socket.username);
                usersNames.push({
                    name: socket.username,
                    nickname:socket.userNickname
                });
                updateUserNames();
            }
            // console.log('firsst time visit');
           
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
    socket.on("updateAvatar",function(src,nickname){
        io.emit('uploadNewAvatar',src,nickname);
    })

   
});
function updateUserNames(){
    // console.log(usersNames);
    io.emit('getUsers',usersNames,usersDataBase);
}

