$(function(){
    var socket = io();
    var userName  = document.querySelector('.name');
    var userNickName = document.querySelector('.nickname');
    var userForm =  document.querySelector('.auth__form');
    var $users = $('.members-list');
    socket.on('connect',(e)=>{
        console.log('hey there');
        socket.emit('get all users');
    })

    //авторизация пользователя
    $('.auth__form').submit(function(e){
        e.preventDefault();
        let user = {
            name:userName.value,
            nickname : userNickName.value,
            history: ''
        }
        socket.emit('new user', userName.value,user,function(data){
            if(data){
                $('.auth').hide();
                $('.chatArea').show(); 
            }
            $('.sidebar__text').html(`${userName.value}`);
            // console.log(user.history);
            socket.on("addHistory",function(history){
                console.log(history);
                $('.chatArea__message-list').append(history);
            })
           
        });
    })

    //вставка сообщения пользователя 
    $('.chatArea__form').submit(function(e){
       
        e.preventDefault(); 
        let time  = `${new Date().getHours()}:${new Date().getMinutes()}`;
        let inputedMsg = document.querySelector('.chatArea__inputMsg');
        socket.emit('chat message', inputedMsg.value,time);
        inputedMsg.value = '';
        
        // return false;
    });
    socket.on('new message', function(msg,){
        var html = `<li class="chatArea__message-item">
        <div>
            <strong>${msg.user} </strong>${msg.time}
        </div>
        <div>
            ${msg.data}
        </div>
        </li>`
        $('.chatArea__message-list').append(html);
        let msgArea =  $('.chatArea__message-list').html();
        console.log(msgArea);
    });

    //получение всех пользователей
    socket.on('getUsers',function(usersData,userDB){
        console.log(userDB);
       
        var html = '';
        for( var i=0; i<usersData.length; i++){
            
            console.log(userDB[i].name);
            html+=`<li>${usersData[i]}</li>`;
        }
        console.log(html);
        $users.html(html);
        
    })

    socket.on('showWhoLeave',function(whoLeaved){
        console.log(`${whoLeaved} leaved`);
        let msgArea =  $('.chatArea__message-list').html();
        // console.log(msgArea);
        socket.emit("takeHistory",msgArea,whoLeaved);
    })
})